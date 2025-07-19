import { NavLink } from "react-router-dom";
import { Home, Plus, MessageCircle, BarChart3, User } from "lucide-react";

export const BottomNavigation = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/create", icon: Plus, label: "Create" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
    { to: "/polls", icon: BarChart3, label: "Polls" },
    { to: "/my-posts", icon: User, label: "My Posts" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-accent bg-accent/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};