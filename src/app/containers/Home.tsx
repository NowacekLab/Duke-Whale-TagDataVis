import React from 'react';
import InitNotification from "../components/InitNotif";

import UploadsPaper from "../components/Upload/UploadsPaper";

const Home = () => {

  return (
    <div className="container">
      
      <UploadsPaper />

      <InitNotification />

    </div>
  );
};

export default Home;