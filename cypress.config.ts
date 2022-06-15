import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    projectId: "yshv48",
    reporterOptions: {
      mochaFile: "bin/cypress/junit-[hash].xml",
    },
    defaultCommandTimeout: 15000,
    retries: {
      runMode: 0,
      openMode: 0,
    },
  },
});
