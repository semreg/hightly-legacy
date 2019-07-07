import React from 'react'

const StatusBar = (streamStatus, serverConnectionStatus) => (
  <>
    <hr/>
    <div className="status-badges">
      <div className='text-muted mt-1'>
        Stream status:&nbsp;&nbsp;
        {streamStatus
          ? <span className="badge badge-success">Online</span>
          : <span className="badge badge-warning">Offline</span>
        }
      </div>
      <div className='text-muted mt-1'>
        Server connection status:&nbsp;&nbsp;
        {serverConnectionStatus === true
          ? <span className="badge badge-success">Online</span>
          : <span className="badge badge-warning">Offline</span>
        }
      </div>
    </div>
    <hr className="my-4" />
  </>
)

export default StatusBar