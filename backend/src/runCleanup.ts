import cron from "node-cron";

cron.schedule("0 0 * * *", () => {
  require("./cleanupDrafts");
});