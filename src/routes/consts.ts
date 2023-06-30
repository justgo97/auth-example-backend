const Paths = {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login", // done
    Register: "/register", // done
    Refresh: "/refresh", // done
  },
  Users: {
    Base: "/users",
    Get: "/all", // done
    Add: "/add", // TODO
    Update: "/update", // done
    Delete: "/delete/:id", // TODO
  },
};

export default Paths;
