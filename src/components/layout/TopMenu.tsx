import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Group, Container, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

interface Page {
  label: string;
  path: string;
  subItems?: { label: string; action: () => void }[];
  dropdownColor?: string;
}

export default function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);

  const path = location.pathname;
  const activePage = path === "/" ? "home" : path.includes("about") ? "about" : "";

  const pages: Page[] = [
    {
      label: "Home",
      path: "/",
      subItems: [
        { label: "Dashboard", action: () => alert("Home Dashboard") },
        { label: "Reports", action: () => alert("Home Reports") },
      ],
      dropdownColor: "#334155",
    },
    {
      label: "About",
      path: "/about",
    },
  ];

  return (
    <Paper
      shadow="xs"
      style={{
        background: "#1e293b",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 60,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Container style={{ display: "flex", alignItems: "stretch", height: "100%" }}>
        <Group style={{ height: "100%", position: "relative" }}>
          {pages.map((page) => {
            const isActive = activePage === page.label.toLowerCase();
            const hasDropdown = page.subItems && page.subItems.length > 0;

            if (hasDropdown) {
              return (
                <div key={page.label} style={{ display: "flex", height: "100%" }}>
                  {/* Main button */}
                  <div
                    onClick={() => navigate(page.path)}
                    onMouseEnter={() => setHovered(page.label)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",   // ✅ ensures underline at bottom
                      padding: "0 20px",
                      minWidth: 120,
                      cursor: "pointer",
                      fontWeight: 600,
                      color: isActive ? "#3b82f6" : "#fff",
                      position: "relative",
                    }}
                  >
                    <Text>{page.label}</Text>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        height: 2,
                        width: "100%",
                        backgroundColor: "#3b82f6",
                        transform:
                          isActive || hovered === page.label
                            ? "translateX(-50%) scaleX(1)"
                            : "translateX(-50%) scaleX(0)",
                        transformOrigin: "center",
                        transition: "transform 0.25s ease",
                      }}
                    />
                  </div>

                  {/* Triangle dropdown trigger */}
                  <Menu withinPortal shadow="md" width={220}>
                    <Menu.Target>
                      <UnstyledButton
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%", // ✅ same height
                          padding: "0 10px",
                          cursor: "pointer",
                          color: "#fff",
                          background: "transparent",
                          transition: "background 0.2s, transform 0.2s",
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <IconChevronDown size={16} />
                      </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown
                      style={{
                        background: page.dropdownColor || "#334155",
                        border: "1px solid #475569",
                      }}
                    >
                      {page.subItems!.map((sub) => (
                        <Menu.Item
                          key={sub.label}
                          onClick={sub.action}
                          style={{ color: "#fff", transition: "background 0.2s" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#64748b")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {sub.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </div>
              );
            }

            // Pages without dropdown
            return (
              <div
                key={page.label}
                onClick={() => navigate(page.path)}
                onMouseEnter={() => setHovered(page.label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",  // ✅ fixes underline
                  padding: "0 20px",
                  minWidth: 120,
                  cursor: "pointer",
                  fontWeight: 600,
                  color: isActive ? "#3b82f6" : "#fff",
                  position: "relative",
                }}
              >
                <Text>{page.label}</Text>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    height: 2,
                    width: "100%",
                    backgroundColor: "#3b82f6",
                    transform:
                      isActive || hovered === page.label
                        ? "translateX(-50%) scaleX(1)"
                        : "translateX(-50%) scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform 0.25s ease",
                  }}
                />
              </div>
            );
          })}
        </Group>
      </Container>
    </Paper>
  );
}
