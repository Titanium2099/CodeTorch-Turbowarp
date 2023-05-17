/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { getIsLoading } from '../reducers/project-state.js';
import DOMElementRenderer from '../containers/dom-element-renderer.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import TWProjectMetaFetcherHOC from '../lib/tw-project-meta-fetcher-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import TWThemeHOC from '../lib/tw-theme-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import TWPackagerIntegrationHOC from '../lib/tw-packager-integration-hoc.jsx';
import TWRestorePointHOC from '../lib/tw-restore-point-hoc.jsx';
import SettingsStore from '../addons/settings-store-singleton';
import '../lib/tw-fix-history-api';
import GUI from './render-gui.jsx';
import MenuBar from '../components/menu-bar/menu-bar.jsx';
import ProjectInput from '../components/tw-project-input/project-input.jsx';
import FeaturedProjects from '../components/tw-featured-projects/featured-projects.jsx';
import Description from '../components/tw-description/description.jsx';
import WebGlModal from '../containers/webgl-modal.jsx';
import BrowserModal from '../components/browser-modal/browser-modal.jsx';
import CloudVariableBadge from '../components/tw-cloud-variable-badge/cloud-variable-badge.jsx';
import { isRendererSupported, isBrowserSupported } from '../lib/tw-environment-support-prober';
import AddonChannels from '../addons/channels';
import { loadServiceWorker } from './load-service-worker';
import runAddons from '../addons/entry';

import SeeInsideButton from '../components/menu-bar/independentseeinside.jsx';


import DropDown from '../components/menu-bar/dropdown.jsx';

import styles from './interface.css';
import { is } from 'core-js/core/object';
/*
if (window.parent !== window) {
    // eslint-disable-next-line no-alert
    alert('This page is embedding TurboWarp in a way that is unsupported and will cease to function in the near future. Please read https://docs.turbowarp.org/embedding');
    throw new Error('Invalid embed');
}
*/
let announcement = null;
if (process.env.ANNOUNCEMENT) {
    announcement = document.createElement('p');
    // This is safe because process.env.ANNOUNCEMENT is set at build time.
    announcement.innerHTML = process.env.ANNOUNCEMENT;
}

const handleClickAddonSettings = () => {
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    window.open(`${process.env.ROOT}${path}`);
};

const messages = defineMessages({
    defaultTitle: {
        defaultMessage: 'Blocks',
        description: 'Title of homepage',
        id: 'tw.guiDefaultTitle'
    }
});

const WrappedMenuBar = compose(
    SBFileUploaderHOC,
    TWPackagerIntegrationHOC
)(MenuBar);

const WrappedDropDown = compose()(DropDown);

if (AddonChannels.reloadChannel) {
    AddonChannels.reloadChannel.addEventListener('message', () => {
        location.reload();
    });
}

if (AddonChannels.changeChannel) {
    AddonChannels.changeChannel.addEventListener('message', e => {
        SettingsStore.setStoreWithVersionCheck(e.data);
    });
}

runAddons();

class Interface extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            loadServiceWorker();
        }
    }
    handleUpdateProjectTitle(title, isDefault) {
        if (isDefault || !title) {
            document.title = `CodeTorch - ${this.props.intl.formatMessage(messages.defaultTitle)}`;
        } else {
            document.title = `${title} - CodeTorch`;
        }
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            intl,
            hasCloudVariables,
            description,
            isFullScreen,
            isLoading,
            isPlayerOnly,
            isRtl,
            onClickTheme,
            projectId,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        const isHomepage = isPlayerOnly && !isFullScreen;
        const isEditor = !isPlayerOnly;
        return (
            <div
                className={classNames(styles.container, {
                    [styles.playerOnly]: isHomepage,
                    [styles.editor]: isEditor
                })}
            >
                {isHomepage ? (
                    <header id="mainHeader" className="header" />

                ) : null}
                {isHomepage ? (
                    /*<div className={styles.menu}>
                        <WrappedMenuBar
                            canChangeLanguage
                            canManageFiles
                            enableSeeInside
                            onClickAddonSettings={handleClickAddonSettings}
                            onClickTheme={onClickTheme}
                        />
                    </div>*/
                    <div class="style-ltfapEKJID7Q">
                        <div id="mainProject" class="style-Y8KgTYv2JHn2">
                            <div
                                className={styles.center}
                                style={isPlayerOnly ? ({
                                    // add a couple pixels to account for border (TODO: remove weird hack)
                                    width: `${Math.max(480, props.customStageSize.width) + 2}px`
                                }) : null}
                            >
                                {isHomepage && announcement ? <DOMElementRenderer domElement={announcement} /> : null}
                                <GUI
                                    onClickAddonSettings={handleClickAddonSettings}
                                    onClickTheme={onClickTheme}
                                    onUpdateProjectTitle={this.handleUpdateProjectTitle}
                                    backpackVisible
                                    backpackHost="_local_"
                                    {...props}
                                />
                                {isHomepage ? (
                                    //global isHomePage
                                    <div id='fakeBody'>

                                    </div>
                                ) : null}

                            </div>
                            <div>
                                <div className="style-Y8KgTYv2JHn2" id="mainProject">
                                    <div className="style-PpX07s8YE4p7">
                                        <div className="style-s3arWEXPYuDZ">
                                            <img
                                                src="../assets/dpfp.png"
                                                className="style-eZM58GkaDM7w"
                                                id="CreatorPFP"
                                            />
                                            <div className="style-ink2ynI1bJmf" id="CreatorName">
                                                {" "}
                                                <span />
                                            </div>
                                        </div>
                                        <div className="style-xGzgnQk5S3fl">
                                            <svg
                                                className="style-a4rq2GlJtB7U"
                                                version="1.1"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="m10 18c-4.4183 0-10-3.5817-10-8 0-4.4183 5.5817-8 10-8s10 3.5817 10 8c0 4.4183-5.5817 8-10 8z"
                                                    fill="#b5b5b5"
                                                />
                                                <circle cx={10} cy={10} fill="#fff" r={4} />
                                            </svg>
                                            <p className="style-93enuXh5WDgf" id="ViewNum">
                                                1
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                marginTop: "auto",
                                                marginBottom: "auto",
                                                height: 25,
                                                marginLeft: 20,
                                                border: "1px solid #b5b5b5",
                                                padding: "2.5px",
                                                borderRadius: "12.5px",
                                                display: "flex"
                                            }}
                                        >
                                            <div style={{ display: "flex", marginRight: 2 }}>
                                                <button className="button liked" id="likeaction">
                                                    <div className="hand">
                                                        <div className="thumb" />
                                                    </div>
                                                </button>
                                                <p
                                                    id="TUNum"
                                                    style={{
                                                        fontSize: 14,
                                                        height: "fit-content",
                                                        width: "fit-content",
                                                        marginLeft: 0,
                                                        marginRight: 5,
                                                        position: "relative",
                                                        top: "-2px"
                                                    }}
                                                >
                                                    1
                                                </p>
                                            </div>
                                            <div style={{ width: 1, backgroundColor: "#bababa" }} />
                                            <div style={{ display: "flex" }}>
                                                <div style={{ transform: "scale(0.3)" }}>
                                                    <button
                                                        id="loveaction"
                                                        className="heart active"
                                                        style={{ position: "relative", top: "-20px" }}
                                                    >
                                                        <div className="heart-flip" />
                                                    </button>
                                                </div>
                                                <p
                                                    id="loveNum"
                                                    style={{
                                                        fontSize: 14,
                                                        height: "fit-content",
                                                        width: "fit-content",
                                                        marginLeft: 0,
                                                        marginRight: 6,
                                                        position: "relative",
                                                        top: "-2px"
                                                    }}
                                                >
                                                    1
                                                </p>
                                            </div>
                                            <div style={{ width: 1, backgroundColor: "#bababa" }} />
                                            <div style={{ display: "flex", marginLeft: 3 }}>
                                                <button className="button" id="dislikeaction">
                                                    <div className="hand" style={{ marginTop: "-10px" }}>
                                                        <div className="thumb" />
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="style-4wIUKg1uzDMv">
                                            <svg
                                                className="style-ZNQCbQ15It2Q"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="style-dS0eqkQbfX9P">
                                        <div><div className="style-rtLRxdnHWBxC" id="preojectTitle">
                                            Untitled
                                        </div>
                                        <reactFragment>
                                            <SeeInsideButton></SeeInsideButton>
                                        </reactFragment>
                                        </div>
                                        <div className="style-2lRZp9ruN1A1" id="proTagPar"></div>
                                        <div>
                                            <p className="style-ZuHf2R9Lhb7M" id="projectDiscription" />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <p
    style={{
      maxWidth: 830,
      marginLeft: "auto",
      marginRight: "auto",
      fontWeight: 900,
      marginTop: 20,
      marginBottom: 20,
      paddingLeft: 20
    }}
  >
    Comments:
  </p>
  <div
    id="feed"
    style={{ margin: "40px auto 60px", width: "100%", maxWidth: 680 }}
  /></div>
                        <div class="style-zdho00SSdcYs" id="morelikethis">
                            <p class="style-xrCOYU2OnP3P">More Like This:</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className={styles.center}
                        style={isPlayerOnly ? ({
                            // add a couple pixels to account for border (TODO: remove weird hack)
                            width: `${Math.max(480, props.customStageSize.width) + 2}px`
                        }) : null}
                    >
                        {isHomepage && announcement ? <DOMElementRenderer domElement={announcement} /> : null}
                        <GUI
                            onClickAddonSettings={handleClickAddonSettings}
                            onClickTheme={onClickTheme}
                            onUpdateProjectTitle={this.handleUpdateProjectTitle}
                            backpackVisible
                            backpackHost="_local_"
                            {...props}
                        />
                        {isHomepage ? (
                            //global isHomePage
                            <div id='fakeBody'>

                            </div>
                        ) : null}

                    </div>
                )}
                {isHomepage}
            </div>
        );
    }
}

Interface.propTypes = {
    intl: intlShape,
    hasCloudVariables: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    description: PropTypes.shape({
        credits: PropTypes.string,
        instructions: PropTypes.string
    }),
    isFullScreen: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickTheme: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    hasCloudVariables: state.scratchGui.tw.hasCloudVariables,
    customStageSize: state.scratchGui.customStageSize,
    description: state.scratchGui.tw.description,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isLoading: getIsLoading(state.scratchGui.projectState.loadingState),
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isRtl: state.locales.isRtl,
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = () => ({});

const ConnectedInterface = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Interface));

const WrappedInterface = compose(
    AppStateHOC,
    ErrorBoundaryHOC('TW Interface'),
    TWProjectMetaFetcherHOC,
    TWStateManagerHOC,
    TWThemeHOC,
    TWRestorePointHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
