import React, { PureComponent } from 'react';
import styled from 'emotion/react';
import ReactSwipe from 'react-swipe';

import {
  ROW_HEIGHT_PX,
  UNITS_IN_PX
} from '../../constants';

import SummaryView from '../SummaryView';
import BacklogView from '../BacklogView';
import CalendarView from '../CalendarView';
import SettingsView from '../SettingsView';
import Heading from '../Heading';


class MobileView extends PureComponent {
  state = {
    activeViewIndex: 0,
  }

  handleSwipe = index => {
    this.setState({ activeViewIndex: index });
  }

  render() {
    const { activeViewIndex } = this.state;

    const views = [
      { name: 'summary', View: SummaryView },
      { name: 'backlog', View: BacklogView },
      { name: 'calendar', View: CalendarView },
      { name: 'settings', View: SettingsView },
    ];

    return (
      <ReactSwipe swipeOptions={{ callback: this.handleSwipe }}>
        {views.map(({ name, View }, index) => (
          <ViewWrapper key={name} isActive={index === activeViewIndex}>
            <MobileHeading>{name}</MobileHeading>
            <View />
          </ViewWrapper>
        ))}
      </ReactSwipe>
    );
  }
}

const ViewWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: ${ROW_HEIGHT_PX} ${UNITS_IN_PX[1]};
  height: ${props => props.isActive ? 'auto' : '100vh'};
`;

const MobileHeading = styled(Heading)`
  margin-bottom: ${UNITS_IN_PX[1]};
  text-transform: capitalize;
  color: COLORS.white;
`;

export default MobileView;
