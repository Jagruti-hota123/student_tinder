const adminAuth = (req, res) => {
  console.log("Admin auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    res.send("All Data send");
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const userAuth = (req, res) => {
  console.log("User auth is getting checked");
  const token = "xyzv";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    res.send("All Data send");
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
