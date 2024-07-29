import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";

export default function FolderBreadcrumbs({ currentFolder }) {
  const location = useLocation();
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];

  const getPathname = (folderId) => {
    if (location.pathname.includes("trash")) {
      return folderId ? `/trash/${folderId}` : "/trash";
    } else if (location.pathname.includes("favourites")) {
      return folderId ? `/favourites/${folderId}` : "/favourites";
    } else {
      return folderId ? `/folder/${folderId}` : "/";
    }
  };

  return (
    <Breadcrumb className="flex-grow-1" listProps={{ className: "bg-white pl-0 m-0" }}>
      {path.map((folder, index) => (
        <Breadcrumb.Item
          key={folder.id}
          linkAs={Link}
          linkProps={{
            to: {
              pathname: getPathname(folder.id),
              state: { folder: { ...folder, path: path.slice(1, index) } },
            },
          }}
          className="text-truncate d-inline-block"
          style={{ maxWidth: "200px" }}
        >
          {folder.name} &nbsp; /
        </Breadcrumb.Item>
      ))}
      {currentFolder && (
        <Breadcrumb.Item className="text-truncate d-inline-block" style={{ maxWidth: "200px" }} active>
          {currentFolder.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}
