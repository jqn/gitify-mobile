import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';

import {
  BackAndroid,
  Navigator,
  StyleSheet
} from 'react-native';

import Constants from './Utils/Constants';
import NavigationBar from './Navigation/NavigationBar';
import SceneContainer from './Navigation/SceneContainer';
import SettingUp from './Components/SettingUp';
import RouteMapper from './Navigation/RouteMapper';
import Routes from './Navigation/Routes';

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: Constants.NAVBAR_BG,
    flexDirection: 'row',
    justifyContent: 'center',
  }
});

class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.navigator;
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
        this.navigator.pop();
        return true;
      }
      return false;
    });
  }

  renderScene(route, navigator) {
    this.navigator = navigator;

    return (
      <SceneContainer
        title={route.title}
        route={route}
        navigator={navigator}
        onBack={() => {
          if (route.index > 0) {
            navigator.pop();
          }
        }}
        {...this.props} />
    );
  }

  _getInitialRoute() {
    if (this.props.isLoggedIn) {
      return Routes.Notifications();
    }
    return Routes.LoginView();
  }

  render() {
    if (!this.props.loaded) {
      return <SettingUp />;
    }

    const initialRoute = this._getInitialRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={this.renderScene.bind(this)}
        navigationBar={<NavigationBar style={styles.navbar} routeMapper={RouteMapper} />} />
    );
  }
};

function mapStateToProps(state) {
  return {
    loaded: state.settings.get('loaded', false),
    isLoggedIn: state.auth.get('token') !== null
  };
};

export default connect(mapStateToProps, null)(AppContainer);
