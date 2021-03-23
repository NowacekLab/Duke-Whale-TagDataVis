import React from 'react';
import SettingsSize from './SettingsSize';
import SettingsCritical from './SettingsCritical';

interface SettingsBodyProps {
  onClose: Function,
}

export default function SettingsBody(props: SettingsBodyProps) {

    return (
      <div
        className="flex-col-center"
        style={{
          gap: "10px"
        }}
      > 
        <SettingsSize 
          onClose={props.onClose}
        />

        <SettingsCritical 
        />

      </div>
    )

}