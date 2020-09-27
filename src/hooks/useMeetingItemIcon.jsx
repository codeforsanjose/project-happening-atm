import React, { useMemo } from 'react';
import MeetingItemStates from '../constants/MeetingItemStates';
import classnames from 'classnames';
import "./MeetingItemIcon.scss";

export const useMeetingItemIcon = ({ meetingItemState }) => {
    const [ stateClassName, icon, statusString ] = useMemo(() => {
        const commonClassName = "top-icon";
        let classname;
        let icon;
        let statusString;

        switch(meetingItemState) {
            case MeetingItemStates.COMPLETED: {
                classname = 'completed';
                icon = <i className={classnames(commonClassName, "fas","fa-check", "fa-sm")}/>;
                statusString = 'Completed';
                break;
            }
            case MeetingItemStates.IN_PROGRESS: {
                classname = 'in-progress';
                icon = (
                    <React.Fragment>
                        <i className={classnames(commonClassName, "fas","fa-circle", "fa-lg")}/>
                        <i className={classnames(commonClassName+"-1", "fas","fa-circle", "fa-lg")}/>
                        <i className={classnames(commonClassName+"-2", "fas","fa-circle", "fa-lg")}/>
                    </React.Fragment>
                );
                statusString = 'In Progress';
                break;
            }
            case MeetingItemStates.MOVED: {
                classname = 'moved';
                icon = <i className={classnames(commonClassName, "fas","fa-exclamation", "fa-sm")}/>;
                statusString = 'Rescheduled';
                break;
            }
            case MeetingItemStates.PENDING:
            default: {
                classname = 'pending';
                icon = <i className={classnames(commonClassName, "fas","fa-circle", "fa-lg")}/>;
                statusString = 'Pending';
                break;
            }
        }

        return [
            classname,
            <div className={classnames("meeting-item-icon", classname)}>
                <i className="background-circle fas fa-circle fa-2x"/>
                {icon}
            </div>,
            statusString
        ]
    }, [meetingItemState]);

    return [ stateClassName, icon, statusString ];
}