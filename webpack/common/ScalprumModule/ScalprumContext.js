import React, { useState, createContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { initialize } from '@scalprum/core'
import { ScalprumProvider } from '@scalprum/react-core';

//const scStore = initialize()

// export const ScalprumContext = createContext(null);

export const ScalprumContextWrapper = ({ children }) => {
  const config = {
    'vulnerability': {
      name: 'vulnerability',
      manifestLocation: `${window.location.origin}/pub/assets/apps/vulnerability/fed-mods.json`,
      cdnPath: `${window.location.origin}/pub/assets/apps/vulnerability/`,
    },
  };

  const scStore = useMemo(() => initialize(        {pluginSDKOptions: {
          pluginLoaderOptions: {
            transformPluginManifest: manifest => {
              if (
                manifest.baseURL === 'auto' &&
                config[manifest.name]?.cdnPath
              ) {
                const _cdnPath = config[manifest.name]?.cdnPath;
                return {
                  ...manifest,
                  baseURL: _cdnPath,
                  loadScripts: manifest.loadScripts.map(
                    script => `${_cdnPath}${script}`
                  ),
                };
              }
              return manifest;
            },
          },
        },
        api: {
          chrome: {
            isBeta: () => false,
            on: () => {},
            auth: {
              getUser: () => Promise.resolve(mockUser),
            },
          },
        },
        config}), [])

  const mockUser = {
    entitlements: {},
    identity: {
      account_number: 'string',
      org_id: 'string',
      internal: {
        org_id: 'string',
        account_id: 'string',
      },
      type: 'string',
      user: {
        username: 'string',
        email: 'string',
        first_name: 'string',
        last_name: 'string',
        is_active: 'boolean',
        is_internal: 'boolean',
        is_org_admin: 'boolean',
        locale: 'string',
      },
    },
  };
  return (
      <ScalprumProvider
        scalprum={scStore}
    >
      {children}
    </ScalprumProvider>
  );
};

ScalprumContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
