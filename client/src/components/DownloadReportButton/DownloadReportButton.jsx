
import React from 'react';
import downloadReport from './utils/downloadReport';

const DownloadReportButton = ({ pipelineId }) => {

    return (
        <button onClick={() => downloadReport(pipelineId)}>
            Скачать отчет
        </button>
    );
};

export default DownloadReportButton;