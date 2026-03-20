import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getQs, getSessionTraceId } from '../services/brainService';
import { getMemorySummary } from '../services/swarmService';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'PROMPT' | 'DECISION' | 'RESPONSE' | 'RECEIPT';
  content: string;
  hash: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface MemoryGraphProps {
  refreshTrigger?: number;
}

export const MemoryGraph: React.FC<MemoryGraphProps> = ({ refreshTrigger = 0 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [memorySummary, setMemorySummary] = useState<string>('');

  useEffect(() => {
    const fetchAndBuildGraph = async () => {
      try {
        const traceId = getSessionTraceId();
        const qs = await getQs(50, undefined, traceId);
        
        const newNodes: GraphNode[] = [];
        const newLinks: GraphLink[] = [];
        
        qs.forEach((q: any) => {
          const baseId = `cmd-${q.hash}`;
          const command = q.coordinate;
          const hash = q.hash;
          
          const promptNode: GraphNode = { id: `${baseId}-prompt`, type: 'PROMPT', content: `User requested: ${command}`, hash: `prompt-${hash}` };
          const decisionNode: GraphNode = { id: `${baseId}-decision`, type: 'DECISION', content: `Routed to ${command.split('|')[0]} agent`, hash: `decision-${hash}` };
          const responseNode: GraphNode = { id: `${baseId}-response`, type: 'RESPONSE', content: `Generated Q Protocol: ${command}`, hash: `response-${hash}` };
          const receiptNode: GraphNode = { id: `${baseId}-receipt`, type: 'RECEIPT', content: `Receipt for ${command}`, hash };

          newNodes.push(promptNode, decisionNode, responseNode, receiptNode);
          newLinks.push(
            { source: promptNode.id, target: decisionNode.id },
            { source: decisionNode.id, target: promptNode.id },
            { source: decisionNode.id, target: responseNode.id },
            { source: responseNode.id, target: decisionNode.id },
            { source: responseNode.id, target: receiptNode.id },
            { source: receiptNode.id, target: responseNode.id }
          );
        });
        
        if (newNodes.length > 0) {
          setNodes(newNodes);
          setLinks(newLinks);
        }
      } catch (err) {
        console.error('Failed to fetch qs for Memory Graph:', err);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await getMemorySummary();
        setMemorySummary(res.summary);
      } catch (e) {
        console.error('Failed to fetch memory summary:', e);
      }
    };

    fetchAndBuildGraph();
    fetchSummary();
    
    const interval = setInterval(() => {
      fetchAndBuildGraph();
      fetchSummary();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    // Define arrow markers for bidirectional edges
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#4b5563')
      .attr('d', 'M0,-5L10,0L0,5');

    const link = g.append('g')
      .attr('stroke', '#4b5563')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    const node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 15)
      .attr('fill', d => {
        switch (d.type) {
          case 'PROMPT': return '#06b6d4'; // cyan
          case 'DECISION': return '#f59e0b'; // amber
          case 'RESPONSE': return '#10b981'; // green
          case 'RECEIPT': return '#ffffff'; // white
          default: return '#9ca3af';
        }
      })
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      });

    svg.on('click', () => setSelectedNode(null));

    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.type.substring(0, 3))
      .attr('font-size', '8px')
      .attr('fill', d => d.type === 'RECEIPT' ? '#000' : '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="flex flex-col h-full relative bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"></div>
      <div className="absolute top-4 left-4 z-10 bg-[#050505]/90 p-4 rounded-lg border border-white/5 backdrop-blur-md shadow-lg">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-purple-400 mb-3">Memory Graph</h3>
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 space-y-2">
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div> PROMPT</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-3 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> DECISION</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> RESPONSE</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-white mr-3 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div> RECEIPT</div>
        </div>
        <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 space-y-1.5 border-t border-white/5 pt-3">
          <div>◈ Claim 24: Bidirectional Memory Graph</div>
          <div>◈ Claim 25: Decision nodes record routing choices</div>
          <div>◈ Claim 27: Graph visualization interface</div>
        </div>
        {memorySummary && (
          <div className="mt-4 text-[11px] font-mono text-purple-400/80 space-y-2 border-t border-white/5 pt-3 max-w-[220px]">
            <div className="font-bold text-purple-400 uppercase tracking-widest">Memory Agent Summary:</div>
            <div className="leading-relaxed">{memorySummary}</div>
          </div>
        )}
      </div>

      <svg ref={svgRef} className="w-full h-full cursor-move bg-[#050505] shadow-inner" />

      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-10 bg-[#050505]/95 p-5 rounded-xl border border-white/10 shadow-2xl max-w-sm backdrop-blur-xl">
          <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-2">{selectedNode.type} Node</h4>
          <div className="text-[13px] text-purple-300/90 font-mono break-all bg-[#0a0a0a] p-3 rounded-lg border border-white/5 mb-3 shadow-inner leading-relaxed">
            {selectedNode.content}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            <strong className="text-zinc-400">BLAKE3:</strong> {selectedNode.hash.slice(0, 16)}...
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1.5">
            <strong className="text-zinc-400">Connected to:</strong> {
              links.filter(l => (l.source as GraphNode).id === selectedNode.id || (l.target as GraphNode).id === selectedNode.id).length
            } nodes
          </div>
        </div>
      )}
    </div>
  );
};
