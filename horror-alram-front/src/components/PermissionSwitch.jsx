import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {memo, useCallback, useEffect, useState} from "react";
import {
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
} from "../functions/messaging";

export function PermissionSwitch() {
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [checkedUpcomingMovie, setCheckedUpcomingMovie] = useState(false);
  const [checkedNetflix, setCheckedNetflix] = useState(false);

  const handleAlarm = useCallback(async () => {
    await handleAlarmPermission().then(result => {
      setCheckedPermission(result);
    });
  }, []);

  const handleUpcomingMovie = useCallback(async () => {
    await handleUpcomingMovieSubscribe(checkedPermission, checkedUpcomingMovie)
    .then(result => {
      setCheckedUpcomingMovie(result);
    });
  }, [checkedPermission, checkedUpcomingMovie]);

  const handleNetflix = useCallback(async () => {
    await handleNetflixSubscribe(checkedPermission, checkedNetflix)
    .then(result => {
      setCheckedNetflix(result);
    });
  }, [checkedPermission, checkedNetflix]);

  const fetchData = useCallback(async () => {
    try {
     return  await handleInitialSubscription();
    } catch (error) {
      console.error('An error occurred while checking token timestamps. ',
          error);
    }
  }, []);

  useEffect(() => {
    fetchData().then(result => {
      setCheckedPermission(result.permission);
      setCheckedUpcomingMovie(result.subscribe[0]);
      setCheckedNetflix(result.subscribe[1]);
    });
  }, [checkedPermission, checkedUpcomingMovie, checkedNetflix, fetchData]);

  return (<Container>
    <FormGroup>
      <AlarmPermissionSwitch checkedPermission={checkedPermission}
                             handleAlarmPermission={handleAlarm}/>
      <UpcomingSubscriptionSwitch checkedUpcomingMovie={checkedUpcomingMovie}
                                  handleUpcomingMovieSubscribe={handleUpcomingMovie}/>
      <NetflixSubscriptionSwitch checkedNetflix={checkedNetflix}
                                 handleNetflixSubscribe={handleNetflix}/>
    </FormGroup>
  </Container>);
}

const AlarmPermissionSwitch = memo(function AlarmPermissionSwitch({
  checkedPermission, handleAlarmPermission
}) {
  return (<FormControlLabel control={<Switch
      checked={checkedPermission}
      onChange={handleAlarmPermission}
      inputProps={{'aria-label': 'controlled'}}
  />} label={checkedPermission ? '알람 권한 허용됨' : '알람 권한 허용하기'}/>)
});

const UpcomingSubscriptionSwitch = memo(function UpcomingSubscriptionSwitch({
  checkedUpcomingMovie, handleUpcomingMovieSubscribe
}) {
  return (<FormControlLabel control={<Switch
      checked={checkedUpcomingMovie}
      onChange={handleUpcomingMovieSubscribe}
      inputProps={{'aria-label': 'controlled'}}
  />} label={checkedUpcomingMovie ? '개봉 예정 영화 알림 중' : '개봉 예정 영화 알림 켜기'}/>)
});

const NetflixSubscriptionSwitch = memo(function NetflixSubscriptionSwitch({
  checkedNetflix, handleNetflixSubscribe
}) {
  return (<FormControlLabel control={<Switch
      checked={checkedNetflix}
      onChange={handleNetflixSubscribe}
      inputProps={{'aria-label': 'controlled'}}
  />} label={checkedNetflix ? '넷플릭스 알림 중' : '넷플릭스 알림 켜기'}/>)
});