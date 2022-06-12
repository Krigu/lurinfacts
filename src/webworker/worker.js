import * as Comlink from "comlink";
import { deleteFact, subscribeToFacts } from "./factsService.js";
import {
  subscribeToImages,
  getDownloadUrl,
  preloadImageByKey,
  loadImageMetaData,
} from "./imageSerivce.js";
import {
  saveImageAndMetadata,
  deleteImageAndMetadata,
} from "./imageUploadService.js";

import {
  addFactProposal,
  getFactsProposals,
  deleteFactProposal,
  acceptFactProposal,
} from "./factsProposalService.js";

import {
  logout,
  resetPasswordRequest,
  login,
  subscribeToLoginState,
} from "./loginService.js";

const dataInterface = {
  deleteFact,
  addFactProposal,
  getFactsProposals,
  deleteFactProposal,
  addFactProposal,
  acceptFactProposal,
  subscribeToFacts,
  subscribeToImages,
  getDownloadUrl,
  preloadImageByKey,
  deleteImageAndMetadata,
  saveImageAndMetadata,
  loadImageMetaData,
  logout,
  resetPasswordRequest,
  login,
  subscribeToLoginState,
};
Comlink.expose(dataInterface, self);
