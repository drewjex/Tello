import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import { userDataRequest, hideModal } from '../../actions';
import {
  ROW_HEIGHT,
  UNITS_IN_PX,
  HEADER_HEIGHT_PX,
  FOOTER_HEIGHT_PX,
  Z_INDICES,
} from '../../constants';
import { isMobile } from '../../helpers/responsive.helpers';
import { getToken, getIsFetching } from '../../reducers/auth.reducer';
import { getNoShowsYet } from '../../reducers/tracked-shows.reducer';

import FlashMessage from '../FlashMessage';
import Header from '../Header';
import MaxWidthWrapper from '../MaxWidthWrapper';
import Modal from '../Modal';
import DesktopNavigation from '../DesktopNavigation';
import Spacer from '../Spacer';
import SpinnerWithPadding from '../SpinnerWithPadding';
import MediaQuery from '../MediaQuery';
import NoShowsYet from '../NoShowsYet';
import FetchEpisodes from '../FetchEpisodes';
import Footer from '../Footer';
import LoggedInScrollbars from '../LoggedInScrollbars';
import Bundle from '../Bundle';

import SummaryView from '../SummaryView';
import BacklogView from '../BacklogView';
import CalendarView from '../CalendarView';
import SettingsView from '../SettingsView';
import LogoutView from '../LogoutView';
import LandingPageView from '../LandingPageView';
import PrivacyPolicyView from '../PrivacyPolicyView';
import TermsOfUseView from '../TermsOfUseView';
import AboutView from '../AboutView';
import ContactView from '../ContactView';
import NotFoundView from '../NotFoundView';

import loadMobileView from 'bundle-loader?lazy!../MobileView';


// NOTE: These routes are not well-designed.
// I got partway through a refactor in f25bf77373d966a057aafa2baf085af9a75f9c28
// but ultimately it was too much work, and too costly.
// That commit should be used as an example for future projects, though.
// Not this code.
class App extends PureComponent {
  static propTypes = {
    hasToken: PropTypes.bool.isRequired,
    noShowsYet: PropTypes.bool.isRequired,
    userDataRequest: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { hasToken, userDataRequest } = this.props;

    if (hasToken) {
      userDataRequest();
    }
  }

  renderLoggedInResponsiveRoutes = (breakpoint) => {
    const { noShowsYet } = this.props;

    if (noShowsYet) {
      return (
        <MaxWidthWrapper>
          <NoShowsYet />
        </MaxWidthWrapper>
      );
    }

    if (isMobile(breakpoint)) {
      return [
        <Switch key="routes">
          <Route
            path="/mobile"
            render={() => (
              <Bundle load={loadMobileView}>
                {
                  (MobileView) => MobileView
                    ? <MobileView />
                    : <SpinnerWithPadding />
                }
              </Bundle>
            )}

          />
          <Redirect from="/login" to="/mobile" />
          <Redirect from="/" to="/mobile" />

          <Route component={NotFoundView} />
        </Switch>,
      ];
    }

    return (
      <MaxWidthWrapper>
        <Spacer size={ROW_HEIGHT} />

        <DesktopNavigation />

        <Switch>
          <Route path="/summary" component={SummaryView} />
          <Route path="/backlog" component={BacklogView} />
          <Route path="/calendar" component={CalendarView} />
          <Route path="/settings" component={SettingsView} />
          <Route path="/logout" component={LogoutView} />

          <Route path="/privacy" component={PrivacyPolicyView} />
          <Route path="/terms" component={TermsOfUseView} />
          <Route path="/contact" component={ContactView} />
          <Route path="/about" component={AboutView} />

          <Redirect from="/login" to="/summary" />
          <Redirect exact from="/" to="/summary" />

          <Route component={NotFoundView} />
        </Switch>
      </MaxWidthWrapper>
    )
  }

  renderLoggedInRoutes() {
    return [
      <Header key="header" />,

      <Body key="body">
        <MediaQuery>
          {this.renderLoggedInResponsiveRoutes}
        </MediaQuery>
      </Body>,

      // Logged-in data component
      <FetchEpisodes key="fetch" />,

      // Style the scrollbars in webkit, depending on what the user's doing.
      <LoggedInScrollbars key="scrollbars" />,
    ];
  }

  renderLoggedOutRoutes() {
    return [
      <Route key="landing" exact path="/" component={LandingPageView} />,
      // NOTE: Duplicated with the logged-in routes.
      // This is a flaw of the current route structure
      <Route key="privacy" path="/privacy" component={PrivacyPolicyView} />,
      <Route key="terms" path="/terms" component={TermsOfUseView} />,
      <Route key="contact" path="/contact" component={ContactView} />,
      <Route key="about" path="/about" component={AboutView} />,

      <Route key="404" component={NotFoundView} />,
    ]
  }

  render() {
    const { hasToken, hideModal } = this.props;

    return [
      <FlashMessage key="flash" />,

      hasToken
        ? this.renderLoggedInRoutes()
        : this.renderLoggedOutRoutes(),

      <Footer key="footer" />,

      <Modal
        key="left-modal"
        side="left"
        handleClose={() => hideModal({ side: 'left' })}
      />,
      <Modal
        key="right-modal"
        side="right"
        handleClose={() => hideModal({ side: 'right' })}
      />,

      <Route key="logout" path="/logout" component={LogoutView} />,
    ]
  }
}

const Body = styled.div`
  position: relative;
  z-index: ${Z_INDICES.root};
  min-height: calc(100vh - ${HEADER_HEIGHT_PX} - ${FOOTER_HEIGHT_PX});
`;


const mapStateToProps = state => ({
  hasToken: !!getToken(state),
  noShowsYet: getNoShowsYet(state),
});

const mapDispatchToProps = { userDataRequest, hideModal };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App));
