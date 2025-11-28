import React, { useEffect } from 'react'

function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);   // ✅ array me dependency
}

export default PageTitle
