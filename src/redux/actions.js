export const SET_TASKS = 'SET_TASKS';
export const SET_TASK_ID = 'SET_TASK_ID';
export const ADD_ALARM = 'ADD_ALARM';
export const DELETE_ALARM = 'DELETE_ALARM';

export const setTasks = tasks => dispatch => {
    dispatch({
        type: SET_TASKS,
        payload: tasks,
    });
};

export const setTaskID = taskID => dispatch => {
    dispatch({
        type: SET_TASK_ID,
        payload: taskID,
    });
};

export const addAlarm = time => {
    return {
      type: ADD_ALARM,
      payload: time,
    };
  };
  
export const deleteAlarm = time => {
    return {
      type: DELETE_ALARM,
      payload: time,
    };
  };