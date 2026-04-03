const Env = {
  API_URL:
    import.meta.env?.VITE_API_URL ?? process.env.API_URL,
};

export {Env};