import React from 'react';
import GUI from '../containers/gui.jsx';

const searchParams = new URLSearchParams(location.search);
//load from cookie 'canSave'
const cloudHost = 'wss://clouddata.turbowarp.org';
const newProject = searchParams.get('new_project') === '1';
const RenderGUI = props => {
    console.log('RenderGUI called with props:', props);
        return (
      <GUI
        cloudHost={cloudHost}
        canSave={true}
        basePath={process.env.ROOT}
        canEditTitle
        enableCommunity
        canRemix={true}
 //       isCreatingNew={newProject}
        {...props}
      />
    );
  };


export default RenderGUI;
