import Coach from './Coach';
import Connect4Game from './connect4/Connect4Game';
import { NNetWrapper as NNet } from './connect4/tensorflow/NNet';

const args = {
  numIters: 3,
  numEps: 3, // 25,
  tempThreshold: 15,
  updateThreshold: 0.6,
  maxlenOfQueue: 200000,
  numMCTSSims: 25,
  arenaCompare: 100, // 40,
  cpuct: 1,

  checkpoint: './temp/',
  load_model: false,
  load_folder_file: { folder: '/dev/models/8x100x50', fileName: 'best.pth.tar' },
  numItersForTrainExamplesHistory: 20,

};

let trainedNN = null;

export function getTrainedNN() {
  return trainedNN;
}

export default async function train() {
  const g = new Connect4Game();
  const nnet = new NNet(g);

  trainedNN = nnet;

  // TODO: low priority
  // if args.load_model:
  //   nnet.load_checkpoint(args.load_folder_file[0], args.load_folder_file[1])

  const c = new Coach(g, nnet, args);
  // if args.load_model:
  // print("Load trainExamples from file")
  // c.loadTrainExamples()

  await c.learn();
}
