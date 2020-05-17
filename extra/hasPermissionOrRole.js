module.exports = (user, { type, data }) => {
    if (user.hasPermission("ADMINISTRATOR")) return true;

    if (type === "PERMISSION") {
        if (user.hasPermission(data)) return true;
    } else if (type === "ROLE") {
        if (user.roles.cache.some(r => r.id == data || r.name == data)) return true;
    }

    return false;
}