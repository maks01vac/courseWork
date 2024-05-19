import axios from 'axios';

const downloadReport = async (pipelineId) => {
    try {
        // Отправляем запрос на сервер, чтобы получить отчет
        const response = await axios.post(
            `http://localhost:3001/api/pipelines/${pipelineId}/report`,
            {}, // Если запрос требует тело, замените на соответствующее значение
            {
                responseType: 'blob', // Этот параметр необходим для получения бинарных данных
            }
        );

        // Создаем временную ссылку для скачивания файла
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `report_pipeline_${pipelineId}.docx`; // Укажите имя файла
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl); // Очищаем временный URL после скачивания
    } catch (error) {
        console.error('Ошибка при скачивании отчета:', error);
    }
};

export default downloadReport;