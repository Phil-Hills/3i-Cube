
import type { ExampleScript } from './types';

export const EXAMPLE_SCRIPTS: ExampleScript[] = [
  {
    name: "Multi-Channel Capture",
    description: "Capture a single frame with three different fluorescent channels.",
    script: `CONNECT|MICROSCOPE[Marianas_SDC]→INITIALIZE|READY
CAPTURE|MULTI[DAPI,GFP,RFP]→EXPOSURE[50ms,100ms,200ms]→MERGE[RGB]→SAVE[merged.tif]|COMPLETE`
  },
  {
    name: "3D Z-Stack Imaging",
    description: "Acquire a 3D volume by imaging at different focal planes.",
    script: `CONNECT|MICROSCOPE[Marianas_SDC]→INITIALIZE|READY
CALIBRATE|FOCUS[AUTOFOCUS]→TARGET[CELL_CENTER]|LOCKED
CAPTURE|ZSTACK[Start:-10um,End:10um,Step:0.5um]→CHANNEL[GFP]→SAVE[volume_3d.tif]|COMPLETE`
  },
  {
    name: "Full Experiment",
    description: "A complex experiment involving calibration, imaging, and analysis.",
    script: `CONNECT|MICROSCOPE[Marianas_SDC]→INITIALIZE|READY
EXPERIMENT|CANCER_CELLS→
  STAIN[Nuclear:DAPI,Membrane:GFP]→
  CAPTURE[MultiChannel_ZStack]→
  ANALYZE[Count_Cells]→
  REPORT[PDF]|COMPLETE`
  },
  {
    name: "Time-Lapse Study",
    description: "Monitor cell division over a 12-hour period.",
    script: `CONNECT|MICROSCOPE[DeepSIM]→INITIALIZE|READY
EXPERIMENT|TIMELAPSE[Cell_Division]→INTERVAL[10min]→DURATION[12h]→CHANNELS[GFP,RFP]|RUNNING`
  }
];
