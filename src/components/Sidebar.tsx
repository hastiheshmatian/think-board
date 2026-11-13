import { LayoutGrid, StickyNote, Settings } from "lucide-react";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

function Sidebar({ showSidebar, setShowSidebar }: SidebarProps) {
  return (
    <>
      <aside className={`sidebar ${showSidebar ? "sidebar-open" : ""}`}>
        <div className="sidebar-menu">
          <p className="menu-title">MENU</p>

          <button className="menu-item active">
            <LayoutGrid size={19} />
            <span>All Notes</span>
          </button>

          <button className="menu-item">
            <StickyNote size={19} />
            <span>My Notes</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="menu-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">H</div>
            <div>
              <strong>My Workspace</strong>
              <small>Personal account</small>
            </div>
          </div>
        </div>
      </aside>

      {showSidebar && (
        <div
          className="sidebar-backdrop"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
