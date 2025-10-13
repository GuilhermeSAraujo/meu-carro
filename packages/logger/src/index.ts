export const log = (str: any) => {
  console.log("logger: " + str);
};

export const logger = {
  debug: (message: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEBUG]", JSON.stringify(message, null, 2));
    }
  },
  info: (message: any) => {
    console.log("[INFO]", JSON.stringify(message, null, 2));
  },
  warn: (message: any) => {
    console.warn("[WARN]", JSON.stringify(message, null, 2));
  },
  error: (message: any) => {
    console.error("[ERROR]", JSON.stringify(message, null, 2));
  },
};
