import React from "react";

import styles from "./Layout.module.scss";

function Layout({ children }) {
  return (
    <main className={styles.layout}>
      <section className={styles.layout__child}>{children}</section>
    </main>
  );
}

export default Layout;
