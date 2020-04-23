//import {message,notification} from 'ant-design-vue'

export const notice = (content, type = 'message', action = 'warning', duration = 3, placement = 'bottomLeft') => {
    destroyNotice();
    let config = {};
    config.duration = duration;
    if (type === 'message') {
        switch (action) {
            case 'info':
                return antd.message.info(content, duration);
            case 'success':
                return antd.message.success(content, duration);
            case 'error':
                return antd.message.error(content, duration);
            case 'loading':
                return antd.message.loading(content, duration);
            default:
                return antd.message.warning(content, duration);
        }
    } else {
        config.message = content.title;
        config.description = content.msg || '';
        config.placement = placement;
        switch (action) {
            case 'open':
                return antd.notification.open(config);
            case 'info':
                return antd.notification.info(config);
            case 'success':
                return antd.notification.success(config);
            case 'error':
                return antd.notification.error(config);
            default:
                return antd.notification.warning(config);
        }
    }
};
export const destroyNotice = (type = '') => {
    if (!type) {
        antd.message.destroy();
        antd.notification.destroy();
    } else {
        type === 'message' ? antd.message.destroy() : antd.notification.destroy();
    }
};