import React, { useState } from "react";
import { Button } from "antd";
import CMSContentEditor from "../components/Editor/Editor";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <CMSContentEditor value={content} onChange={setContent} />
    </div>
  );
};

export default PrivacyPolicyPage;
