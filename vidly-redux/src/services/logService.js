import Raven from "raven-js";

function init() {
  Raven.config(
    "https://6b13bf6c6022467cb7e723c53a055d01@o949752.ingest.sentry.io/5898470",
    {
      release: "1-0-0",
      environment: "development",
    }
  ).install();
}

function log(error) {
  Raven.captureException(error);
}

const logger = {
  init,
  log,
};

export default logger;
