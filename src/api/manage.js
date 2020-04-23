import {
    axios
} from '@/utils/request';
//import axios from 'axios';
//import superagent from 'superagent';
//import * as _ from 'underscore';
import * as storage from '@/utils/storage';
import * as tools from '@/utils/util';
//import * as $ from 'jquery';
import * as workflowAPI from '@/api/workflow';

try {
    axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded';
} catch (e) {
    console.error(e);
}

export const api = {
    domain: window._CONFIG['domain'],
    restapi: window._CONFIG['restAPI'],
    token: `${window._CONFIG['domain']}/jeecg-boot/sys/common/token`,
    user: `${window._CONFIG['domain']}/jeecg-boot/api/user`,
    role: `${window._CONFIG['domain']}/jeecg-boot/api/role`,
    service: `${window._CONFIG['domain']}/jeecg-boot/api/service`,
    permission: `${window._CONFIG['domain']}/jeecg-boot/api/permission`,
    permissionNoPager: `${window._CONFIG['domain']}/jeecg-boot/api/permission/no-pager`,
    PROCESS_NODE_DICT_ID: '095a5c3fed5b29706cdfc6d9cb32cd4c', //流程节点，对应的字典的ID,根据这个查询流程节点的名称
};

//post
export async function postAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'post',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//post method= {post | put}
export async function httpAction(url, parameter, method) {
    try {
        return axios({
            url: url,
            method: method,
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//put
export async function putAction(url, parameter) {

    try {
        return axios({
            url: url,
            method: 'put',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//get
export async function getAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//deleteAction
export async function deleteAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'delete',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getUserList(parameter) {
    try {
        return axios({
            url: api.user,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getRoleList(parameter) {
    try {
        return axios({
            url: api.role,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getServiceList(parameter) {
    try {
        return axios({
            url: api.service,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getPermissions(parameter) {
    try {
        return axios({
            url: api.permissionNoPager,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * @function 获取用户信息操作
 */
export function getInfo() {
    try {
        return axios({
            url: `${window._CONFIG['domainURL']}/api/user/info`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * @function 保存操作
 */
export async function saveService(parameter) {
    try {
        return axios({
            url: api.service,
            method: parameter.id == 0 ? 'post' : 'put',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * @function 定时刷新Token，保持连接，Keep-Alive
 */
export async function queryToken() {
    try {
        var token = storage.getStore('pro__Access-Token');

        var queryURL = `${api.token}/${token.value}`;

        var result = await superagent.get(queryURL);

        return result;
    } catch (error) {
        console.log(' error : ' + error);
    }
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export async function downFile(url, parameter) {
    //检查此处的URL,改成Nginx服务器对应的下载地址
    console.log(' download url :' + url);

    try {
        return axios({
            url: url,
            params: parameter,
            method: 'get',
            responseType: 'blob',
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * 获取文件访问路径
 * @param avatar
 * @param imgerver
 * @param str
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar, imgerver, subStr) {
    if (avatar && avatar.indexOf(subStr) != -1) {
        return avatar;
    } else {
        return imgerver + '/' + avatar;
    }
}

/**
 * 查询URL地址TableID变量
 */
export function queryURLTableParam() {
    var url = null;
    try {
        url = document.location.toString();
        url = url.substring(url.lastIndexOf('/') + 1, url.length);
        console.log('tableID : ' + url);
        return url;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询当前业务对应表单名称
 * @param {*} url
 */
export async function queryTableName(callback) {
    //获取主键ID
    var tableID = queryURLTableParam();
    //查询URL
    var queryURL = `${api.restapi}/api/onl_cgform_head/${tableID}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]);
        }

        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * 检测审批是否存在 存在 false  不存在 true
 * @param {*} tableName
 * @param {*} businessID
 */
export async function queryApprovalExist(tableName, businessID) {

    //大写转小写
    tableName = tableName.toLowerCase();
    //查询URL GET	/api/tableName/:id/exists	True or false whether a row exists or not  /api/tableName/findOne
    var queryURL = `${api.restapi}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})`;

    //查询标识
    var vflag = false;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        vflag = res.body.length > 0 ? true : false;

        return vflag;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 检测审批是否存在 存在 false  不存在 true
 * @param {*} tableName
 * @param {*} businessID
 */
export async function queryApprovalLength(tableName, businessID) {

    //大写转小写
    tableName = tableName.toLowerCase();
    //查询URL GET	/api/tableName/:id/exists	True or false whether a row exists or not  /api/tableName/findOne
    var queryURL = `${api.restapi}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})`;

    //查询标识
    var vflag = false;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        vflag = res.body.length;

        return vflag;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 添加数据
 * @param {*} tableName
 * @param {*} id
 */
export async function insertTableData(tableName, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //Post数据的URL地址
    var insertURL = `${api.restapi}/api/${tableName}`;

    //如果传入数据为数组，则URL添加bulk路径
    if (typeof node != 'undefined' && node != null && node instanceof Array) {
        insertURL = insertURL + '/bulk';
    }

    try {
        const res = await superagent
            .post(insertURL)
            .send(node)
            .set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

export async function postTableData(tableName, node) {

    //大写转小写
    tableName = tableName.toLowerCase();
    //Post数据的URL地址
    var insertURL = `${api.restapi}/api/${tableName}`;

    //如果传入数据为数组，则URL添加bulk路径
    if (typeof node != 'undefined' && node != null && node instanceof Array) {
        insertURL = insertURL + '/bulk';
    }

    try {
        const res = await superagent
            .post(insertURL)
            .send(node)
            .set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * 添加数据
 * @param {*} tableName
 * @param {*} id
 */
export async function deleteTableData(tableName, id) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //Post数据的URL地址
    var deleteURL = `${api.restapi}/api/${tableName}/${id}`;

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 更新数据
 * @param {*} tableName
 * @param {*} id
 * @param {*} node
 */
export async function patchTableData(tableName, id, node) {

    //大写转小写
    tableName = tableName.toLowerCase();
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var patchURL = `${api.restapi}/api/${tableName}/${id}`;

    //如果传入数据为空，则直接返回错误
    if (typeof node == 'undefined' || node == null || node == '') {
        return false;
    }

    try {
        const res = await superagent
            .patch(patchURL)
            .send(node)
            .set('accept', 'json');

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 更新数据
 * @param {*} tableName
 * @param {*} id
 * @param {*} node
 */
export async function patchTableItem(tableName, id, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    try {
        return patchTableData(tableName, id, node);
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} id
 */
export async function queryTableData(tableName, id) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.restapi}/api/${tableName}/${id}`;

    try {
        //获取缓存中的数据
        var cache = storage.getStore(`sys_user_cache@${tableName}&id${id}`);

        //返回缓存值
        if (typeof cache != 'undefined' && cache != null && cache != '') {
            return cache;
        }

        const res = await superagent.get(queryURL).set('accept', 'json');

        if (res.body != null && res.body.length > 0) {
            storage.setStore(`sys_user_cache@${tableName}&id${id}`, res.body[0], 2);
        }

        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 分页查询表单数据
 */
export async function queryTableDataByParam(
    tableName,
    username,
    realname,
    page,
    size,
    param
) {}

/**
 * 查询数据(all)
 * @param {*} tableName
 */
export async function queryTableAll(tableName) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //查询URL Get	/api/tableName	query all rows by tableName
    var queryURL = `${api.restapi}/api/${tableName}`;
    //定义查询结果
    var result = null;

    try {
        //先检测缓存中，是否有数据，如果没有数据，则从数据库中查询
        result = storage.getStore('system_table_data_info_all');

        if (!(typeof result != 'undefined' && result != null && result != '')) {
            //发送HTTP请求，获取返回值后，设置数据
            const res = await superagent.get(queryURL).set('accept', 'json');
            result = res.body;

            //遍历并格式化日期
            window.__.each(result, function(item) {
                var optime = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
                item['createtime'] = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                item['timestamp'] = time;
                item['create_time'] = optime;
            });

            //设置缓存数据，缓存时间，暂定为5秒钟
            storage.setStore('system_table_data_info_all', result, 5);
        }
    } catch (err) {
        console.log(err);
    }

    //返回查询后的数据
    return result;
}

/**
 * @function 查询部门信息
 */
export async function queryDepartName(id) {
    //设置查询URL
    var queryURL = `${api.restapi}/api/v_depart_name?_where=(id,eq,${id})&_p=0&_size=10`;
    //定义查询结果
    var result = null;

    try {
        //先检测缓存中，是否有数据，如果没有数据，则从数据库中查询
        result = storage.getStore(`system_depart_name_by_id@${id}`);

        if (!(typeof result != 'undefined' && result != null && result != '')) {
            //发送HTTP请求，获取返回值后，设置数据
            const res = await superagent.get(queryURL).set('accept', 'json');

            //获取返回结果
            result = res.body[0];

            //设置缓存数据，缓存时间，暂定为5秒钟
            storage.setStore(`system_depart_name_by_id@${id}`, result, 3600 * 2);
        }
    } catch (err) {
        console.log(err);
    }

    //返回查询后的动态数据
    return result;
}

export async function queryDynamic() {
    //设置查询URL
    var queryURL = `${api.restapi}/api/bs_dynamic?_size=10&_sort=-create_time`;
    //定义查询结果
    var result = null;

    try {
        //先检测缓存中，是否有数据，如果没有数据，则从数据库中查询
        result = storage.getStore('system_dynamic_info_all');

        if (!(typeof result != 'undefined' && result != null && result != '')) {
            //发送HTTP请求，获取返回值后，设置数据
            const res = await superagent.get(queryURL).set('accept', 'json');
            result = res.body;

            //遍历并格式化日期
            window.__.each(result, function(item) {
                var optime = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
                item['createtime'] = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                item['timestamp'] = time;
                item['create_time'] = optime;
            });

            //设置缓存数据，缓存时间，暂定为5秒钟
            storage.setStore('system_dynamic_info_all', result, 3600 * 2);
        }
    } catch (err) {
        console.log(err);
    }

    //返回查询后的动态数据
    return result;
}

export async function queryDynamicByUser(username) {
    //设置查询URL
    var queryURL = `${api.restapi}/api/bs_dynamic?_where=(relate_users,like,~${username}~)&_size=10&_sort=-create_time`;
    //定义查询结果
    var result = null;

    try {
        //先检测缓存中，是否有数据，如果没有数据，则从数据库中查询
        result = storage.getStore(`system_dynamic_info_by_user@${username}`);

        if (!(typeof result != 'undefined' && result != null && result != '')) {
            //发送HTTP请求，获取返回值后，设置数据
            const res = await superagent.get(queryURL).set('accept', 'json');
            result = res.body;

            //遍历并格式化日期
            window.__.each(result, function(item) {
                var optime = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
                item['createtime'] = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                item['timestamp'] = time;
                item['create_time'] = optime;
            });

            //设置缓存数据，缓存时间，暂定为5秒钟
            storage.setStore(
                `system_dynamic_info_by_user@${username}`,
                result,
                3600 * 2
            );
        }
    } catch (err) {
        console.log(err);
    }

    //返回查询后的动态数据
    return result;
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableDataByField(tableName, field, value) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.restapi}/api/${tableName}?_where=(${field},eq,${value})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

export async function queryUserInfoByView(username) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.restapi}/api/v_user?_where=(username,eq,${username})`;

    //定义查询结果
    var result = null;

    try {
        //先检测缓存中，是否有数据，如果没有数据，则从数据库中查询
        result = storage.getStore(`system_v_user_info@username$${username}`);

        if (!(typeof result != 'undefined' && result != null && result != '')) {
            //发送HTTP请求，获取返回值后，设置数据
            const res = await superagent.get(queryURL).set('accept', 'json');
            //设置返回结果
            result = res.body;

            //设置缓存数据，缓存时间，暂定为5秒钟
            storage.setStore(
                `system_v_user_info@username$${username}`,
                result,
                3600 * 24
            );
        }
    } catch (err) {
        console.log(err);
    }

    //返回查询后的动态数据
    return result;
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableDataAll(tableName) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.restapi}/api/${tableName}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询表单字段数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableFieldInfo(tableName, field, value) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.restapi}/api/${tableName}?_where=(name,eq,${field})~and(field,eq,${value})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询流程权责业务信息
 */
export async function queryBusinessInfo(tableName, callback) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //查询URL
    var queryURL = `${api.restapi}/api/pr_rights?_where=(business,like,~${tableName}~)`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body);
        }

        return JSON.parse(JSON.stringify(res.body));
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的员工信息
 */
export async function queryProcessNodeEmployee(node, callback) {
    //查询URL
    var queryURL = `${api.restapi}/api/bs_approve_node?_where=(name,eq,${node})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]['item_text']);
        }

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessNodeProcName(node, callback) {
    //查询URL
    var queryURL = `${api.restapi}/api/sys_dict_item?_where=(dict_id,eq,${api.PROCESS_NODE_DICT_ID})~and(item_value,eq,${node})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]['item_text']);
        }

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询审批处理页面的记录
 */
export async function queryUserList(params) {
    //pageNo从0开始计算
    params.pageNo = params.pageNo - 1;

    //用户名称
    var whereFlag =
        tools.deNull(params.username) == '' ?
        '' :
        `_where=(username,like,~${params.username}~)~or(realname,like,~${params.username}~)&`;

    //获取排序标识，升序 ‘’ ， 降序 ‘-’
    var ascFlag = params.order == 'asc' ? '' : '-';

    //查询URL
    var queryURL = `${api.restapi}/api/v_user?${whereFlag}_p=${params.pageNo}&_size=${params.pageSize}&_sort=${ascFlag}${params.column}`;
    var queryCountURL = `${api.restapi}/api/v_user/count?${whereFlag}`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);

        //遍历并设置属性
        window.__.each(res.body, item => {
            item['status'] = '1';
            item['orgCode'] = '';
            item['updateBy'] = '';
            item['createTime'] = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            item['createBy'] = 'admin';
            item['workNo'] = '';
            item['delFlag'] = '0';
            item['status_dictText'] = '';
            item['birthday'] = tools.formatDate(item['birthday'], 'yyyy-MM-dd');
            item['updateTime'] = item['createTime'];
            item['telephone'] = item['phone'];
            item['activitiSync'] = '';
            item['sex'] = '1';
            item['sex_dictText'] = '';
        });

        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= params.pageSize ?
            res.body.length :
            count.body[0].no_of_rows;

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询审批处理页面的记录
 */
export async function queryProcessLogToApproved(username, realname, params) {
    //pageNo从0开始计算
    params.pageNo = params.pageNo - 1;

    //查询URL
    var queryURL = `${api.restapi}/api/pr_log?_where=(employee,like,~${username}~)~or(employee,like,~${realname}~)&_p=${params.pageNo}&_size=${params.pageSize}`;
    var queryCountURL = `${api.restapi}/api/pr_log/count?_where=(employee,like,~${username}~)~or(employee,like,~${realname}~)`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);
        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询审批历史记录页面的记录
 */
export async function queryProcessLogHisApproved(username, realname, params) {
    //pageNo从0开始计算
    params.pageNo = params.pageNo - 1;

    //查询URL
    var queryURL = `${api.restapi}/api/pr_log_history?_where=(approve_user,like,~${username}~)~or(approve_user,like,~${realname}~)~or(proponents,like,~${username}~)~or(proponents,like,~${realname}~)&_p=${params.pageNo}&_size=${params.pageSize}&_sort=-operate_time`;
    var queryCountURL = `${api.restapi}/api/pr_log_history/count?_where=(approve_user,like,~${username}~)~or(approve_user,like,~${realname}~)~or(proponents,like,~${username}~)~or(proponents,like,~${realname}~)`;
    var result = {};

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);
        result.records = res.body;

        //遍历并格式化日期
        window.__.each(result.records, function(item) {
            var optime = tools.formatDate(
                item['operate_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            optime = optime.replace('T', ' ');
            item['operate_time'] = optime;
        });

        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;
        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询我的待办数据
 */
export async function queryProcessLogWait(
    username,
    realname,
    page = 0,
    size = 50
) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_handling_events?_where=(username,like,~${username}~)~or(username,like,~${realname}~)&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;
        result = window.__.filter(result, function(item) {
            //格式化日期
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['timestamp'] = time;
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['username'] = tools.deNull(item['username']).split(',');
            item['content'] = tools.abbreviation(tools.delHtmlTag(item['content']));
            item['topic'] = tools.abbreviation(tools.delHtmlTag(item['topic']));

            //查询是否存在此用户名，且已处理用户中，不含登录用户
            var flag =
                (window.__.contains(item['username'], username) ||
                    window.__.contains(item['username'], realname)) &&
                !item.user.includes(username);

            //返回结果
            return flag;
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询用户名称信息
 */
export async function queryUserName() {
    //查询URL
    var index = 0;
    var queryURL;
    var result = [];

    try {
        //从缓存中获取用户数据
        var userlist = storage.getStore('cache_all_user_name');

        if (
            typeof userlist == 'undefined' ||
            userlist == null ||
            userlist.length == 0
        ) {
            while (index < 10000) {
                queryURL = `${api.restapi}/api/v_uname?_p=${index++}&_size=50`;
                var res = await superagent.get(queryURL).set('accept', 'json');
                result = result.concat(res.body);
                //如果返回结果数据小于size，则表示查询到末页，不在查询
                if (res.body.length < 50) {
                    break;
                } else {
                    continue;
                }
            }

            //将用户数据设置到缓存中
            storage.setStore('cache_all_user_name', result, 3600 * 24);
        } else {
            result = userlist;
        }

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询用户名称信息
 */
export function queryUserNameByCache() {
    //返回对象结果
    var result = [];

    try {
        //从缓存中获取用户数据
        var userlist = storage.getStore('cache_all_user_name');

        if (
            typeof userlist == 'undefined' ||
            userlist == null ||
            userlist.length == 0
        ) {
            result = [];
        } else {
            result = userlist;
        }
    } catch (err) {
        console.log(err);
    }

    return result;
}

/**
 * @function 检查是否存在流程
 */
export async function queryExistWorkflow(id) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_handling_events?_where=(id,eq,${id})`;
    //返回结果对象
    var result = {};

    try {
        var res = await superagent.get(queryURL).set('accept', 'json');

        if (
            typeof res.body != 'undefined' &&
            res.body != null &&
            res.body.length > 0
        ) {
            result = res.body[0];
        }
    } catch (err) {
        console.log('打印错误日志：' + err);
    }

    return result;
}

/**
 * 查询工作流程的节点配置(审核节点、审批节点、知会节点)
 */
export async function queryWorkflowNode(id) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_workflow_node?_where=(id,eq,${id})`;
    //返回结果对象
    var result = {};

    try {
        var res = await superagent.get(queryURL).set('accept', 'json');

        if (
            typeof res.body != 'undefined' &&
            res.body != null &&
            res.body.length > 0
        ) {
            result = res.body[0];

            if (result.notify == null || result.notify == '') {
                let notifynode = storage.getStore(
                    `workflows_notify_node_by_data_id@${id}`
                );
                result.notify = notifynode.employee + ',' + notifynode.appruser;
                console.log('知会人员：' + result.notify);
            }

            //获取当前正在审批用户
            let auditnode = storage.getStore(`workflows_audit_node_by_data_id@${id}`);
            result.operate = auditnode.employee;
        }
    } catch (err) {
        console.log('打印错误日志：' + err);
    }

    return result;
}

/**
 * 查询工作流程的节点配置(审核节点、审批节点、知会节点)
 */
export async function queryWorkflowNodeByUser(tableName, username) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_workflow_type_node?_where=(tname,eq,${tableName})~and(cname,eq,${username})`;
    //返回结果对象
    var result = {};

    try {
        var res = await superagent.get(queryURL).set('accept', 'json');

        if (
            typeof res.body != 'undefined' &&
            res.body != null &&
            res.body.length > 0
        ) {
            result = res.body[0];
        }
    } catch (err) {
        console.log('打印错误日志：' + err);
    }

    return result;
}

/**
 * 查询我的待办数据
 */
export async function queryProcessLogWaitByParam(
    username,
    param,
    page = 0,
    size = 50
) {
    //条件SQL
    var whereSQL = '';

    //根据条件构造参数
    if (tools.deNull(param.type) != '') {
        whereSQL = whereSQL + `~and(type,eq,${param.type})`;
    }
    if (tools.deNull(param.name) != '') {
        whereSQL = whereSQL + `~and(tname,eq,${param.name})`;
    }
    if (tools.deNull(param.topic) != '') {
        whereSQL = whereSQL + `~and(topic,like,~${param.topic}~)`;
    }
    if (tools.deNull(param.startman) != '') {
        whereSQL = whereSQL + `~and(sponsor,like,~${param.startman}~)`;
    }
    if (tools.deNull(param.time) != '') {
        var starttime = '';
        var endtime = '';

        //设置时间
        if (param.time.length == 0) {
            starttime = new Date();
            endtime = new Date();
        } else if (param.time.length == 1) {
            starttime = param.time[0].format('YYYY-MM-DD');
            endtime = param.time[1].format('YYYY-MM-DD');
        } else if (param.time.length >= 2) {
            starttime = param.time[0].format('YYYY-MM-DD');
            endtime = param.time[1].format('YYYY-MM-DD');
        }

        starttime = tools.formatDate(starttime, 'yyyy-MM-dd') + ' 00:00:00';
        endtime = tools.formatDate(endtime, 'yyyy-MM-dd') + ' 23:59:59';

        whereSQL = whereSQL + `~and(create_time,bw,${starttime},${endtime})`;
    }

    //查询URL
    var queryURL = `${api.restapi}/api/v_handling_events?_where=(username,like,~${username}~)${whereSQL}&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['timestamp'] = time;
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['username'] = tools.deNull(item['username']).split(',');
            item['content'] = tools.abbreviation(tools.delHtmlTag(item['content']));
            item['topic'] = tools.abbreviation(tools.delHtmlTag(item['topic']));

            //查询是否存在此用户名
            var flag = window.__.contains(item['username'], username);

            //返回结果
            return flag;
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询我的已办数据
 */
export async function queryProcessLogDoneByTime(
    username,
    realname,
    page = 0,
    size = 50,
    time
) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_handled_events_unq?_where=(username,like,~${username}~)~and(create_time,gte,${time})&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['content'] = tools.abbreviation(tools.delHtmlTag(item['content']));
            item['topic'] = tools.abbreviation(tools.delHtmlTag(item['topic']));

            //查询是否存在此用户名
            var flag =
                window.__.contains(item['username'], username) ||
                window.__.contains(item['username'], realname);

            //返回结果
            return flag;
        });

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询最新的10篇博文数据
 */
export async function queryBlogInfoNew(page = 0, size = 10) {

    //查询URL
    var queryURL = `${api.restapi}/api/bs_blog?_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['description'] = tools.abbreviation(
                tools.delHtmlTag(item['content']),
                300
            );
            item['title'] = item['name'] = tools.abbreviation(
                tools.delHtmlTag(item['blog_title']),
                100
            );
            item['avatar'] = "/images/icon-blog-hot.svg";

            //返回结果
            return true;
        });

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询我的博文数据
 */
export async function queryBlogInfoByUser(username, page = 0, size = 50) {


    //查询URL
    var queryURL = `${api.restapi}/api/bs_blog?_where=(create_by,eq,${username})&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['description'] = tools.abbreviation(
                tools.delHtmlTag(item['content']),
                300
            );
            item['title'] = tools.abbreviation(
                tools.delHtmlTag(item['blog_title']),
                100
            );

            //返回结果
            return true;
        });

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询所有博文数据
 */
export async function queryBlogInfo(
    page = 0,
    size = 50,
    username,
    nousername,
    starttime,
    endtime
) {
    //查询URL
    var queryURL = `${api.restapi}/api/bs_blog?_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['description'] = tools.abbreviation(
                tools.delHtmlTag(item['content']),
                300
            );
            item['title'] = tools.abbreviation(
                tools.delHtmlTag(item['blog_title']),
                100
            );

            //返回结果
            return true;
        });

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询我的已办数据
 */
export async function queryProcessLogDone(
    username,
    realname,
    page = 0,
    size = 50
) {
    //查询URL
    var queryURL = `${api.restapi}/api/v_handled_events_unq?_where=(username,like,~${username}~)~or(username,like,~${realname}~)&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['content'] = tools.abbreviation(tools.delHtmlTag(item['content']));
            item['topic'] = tools.abbreviation(tools.delHtmlTag(item['topic']));

            //查询是否存在此用户名
            var flag =
                window.__.contains(item['username'], username) ||
                window.__.contains(item['username'], realname);

            //返回结果
            return flag;
        });

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询我的已办数据
 */
export async function queryProcessLogDoneAll(username, realname) {
    //返回结果
    var result = [];
    //遍历计数器
    var i = 0;

    try {
        result = storage.getStore(`system_process_log_done_all_user@${username}`);

        if (tools.isNull(result) || result.length == 0) {
            result = [];

            for (i = 0; i < 1000000; i++) {
                const list = await queryProcessLogDone(username, realname, i, 50);
                console.log(` 第${i}次 查询数据 ：${JSON.stringify(list)}`);
                if (typeof list == 'undefined' || list == null || list.length == 0) {
                    break;
                } else {
                    result = result.concat(list);
                }
            }

            //遍历数据，将英文名转为中文名
            for (let item of result) {
                try {
                    item['username'] = await patchEnameCname(item['username'].toString());
                    item['proponents'] = await patchEnameCname(item['proponents']);

                    item['username'] = tools.deNull(item['username']).split(',');
                } catch (error) {
                    console.log(error);
                }
            }

            //根据ID编号去掉重复的数据
            result = window.__.uniq(result, false, 'id');

            //将数据缓存到localstorage中
            storage.setStore(
                `system_process_log_done_all_user@${username}`,
                JSON.stringify(result),
                3600 * 24
            );
        } else {
            //获取到数据，查询最新的数据，取出数组中第一条数据，然后查询时间大于等于这条的待办，然后去掉重复数据
            var first = window.__.max(result, function(item) {
                let time = tools.isNull(item.timestamp) ?
                    tools.formatDate(new Date(item.create_time), 'yyyyMMddhhmmss') :
                    item.timestamp;
                return time;
            });
            var curtime = tools.isNull(first.createtime) ?
                tools.formatDate(first['create_time'], 'yyyy-MM-dd hh:mm:ss') :
                first.createtime;
            var nlist = [];

            for (i = 0; i < 1000000; i++) {
                const list = await queryProcessLogDoneByTime(
                    username,
                    realname,
                    i,
                    50,
                    curtime
                );
                console.log(` 第${i}次 查询数据 ：${JSON.stringify(list)}`);
                if (typeof list == 'undefined' || list == null || list.length == 0) {
                    break;
                } else {
                    nlist = nlist.concat(list);
                }
            }

            //遍历数据，将英文名转为中文名
            for (let item of nlist) {
                try {
                    item['username'] = await patchEnameCname(item['username'].toString());
                    item['proponents'] = await patchEnameCname(item['proponents']);

                    item['username'] = tools.deNull(item['username']).split(',');
                } catch (error) {
                    console.log(error);
                }
            }

            //合并原始数据和最新查询处理的数据
            result = result.concat(nlist);

            //根据ID编号去掉重复的数据
            result = window.__.uniq(result, false, 'id');

            //根据时间戳排序
            result = window.__.sortBy(result, item => {
                return item['timestamp'] * -1;
            });

            //将数据缓存到localstorage中
            storage.setStore(
                `system_process_log_done_all_user@${username}`,
                JSON.stringify(result),
                3600 * 24
            );
        }

        //返回查询结果
        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询我的待办数据
 */
export async function queryProcessLogWaitAll(username, realname) {
    //返回结果
    var result = [];

    try {
        for (var i = 0; i < 1000000; i++) {
            const list = await queryProcessLogWait(username, realname, i, 50);
            console.log(` 第${i}次 查询数据 ：${JSON.stringify(list)}`);
            if (typeof list == 'undefined' || list == null || list.length == 0) {
                break;
            } else {
                result = result.concat(list);
            }
        }

        //遍历数据，将英文名转为中文名
        for (var item of result) {
            try {
                item['username'] = await patchEnameCname(item['username'].toString());
                item['proponents'] = await patchEnameCname(item['proponents']);

                item['username'] = tools.deNull(item['username']).split(',');
            } catch (error) {
                console.log(error);
            }
        }

        //返回查询结果
        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询我的已办数据（条件查询ALL）
 */
export async function queryProcessLogDoneByParamAll(username, param) {
    //返回结果
    var result = [];

    try {
        for (var i = 0; i < 1000000; i++) {
            const list = await queryProcessLogDoneByParam(username, param, i, 50);
            console.log(` 第${i}次 查询数据 ：${JSON.stringify(list)}`);
            if (typeof list == 'undefined' || list == null || list.length == 0) {
                break;
            } else {
                result = result.concat(list);
            }
        }

        //遍历数据，将英文名转为中文名
        for (var item of result) {
            try {
                item['username'] = await patchEnameCname(item['username'].toString());
                item['proponents'] = await patchEnameCname(item['proponents']);

                item['username'] = tools.deNull(item['username']).split(',');
            } catch (error) {
                console.log(error);
            }
        }

        //根据ID编号去掉重复的数据
        result = window.__.uniq(result, false, 'id');

        //根据时间戳排序
        result = window.__.sortBy(result, item => {
            return item['timestamp'] * -1;
        });

        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询我的待办数据（条件查询ALL）
 */
export async function queryProcessLogWaitByParamAll(username, param) {
    //返回结果
    var result = [];

    try {
        for (var i = 0; i < 1000000; i++) {
            const list = await queryProcessLogWaitByParam(username, param, i, 50);
            console.log(` 第${i}次 查询数据 ：${JSON.stringify(list)}`);
            if (typeof list == 'undefined' || list == null || list.length == 0) {
                break;
            } else {
                result = result.concat(list);
            }
        }

        //遍历数据，将英文名转为中文名
        for (var item of result) {
            try {
                item['username'] = await patchEnameCname(item['username'].toString());
                item['proponents'] = await patchEnameCname(item['proponents']);

                item['username'] = tools.deNull(item['username']).split(',');
            } catch (error) {
                console.log(error);
            }
        }

        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询我的已办数据（条件查询）
 */
export async function queryProcessLogDoneByParam(
    username,
    param,
    page = 0,
    size = 50
) {
    //条件SQL
    var whereSQL = '';

    //根据条件构造参数
    if (tools.deNull(param.type) != '') {
        whereSQL = whereSQL + `~and(type,eq,${param.type})`;
    }
    if (tools.deNull(param.name) != '') {
        whereSQL = whereSQL + `~and(tname,eq,${param.name})`;
    }
    if (tools.deNull(param.topic) != '') {
        whereSQL = whereSQL + `~and(topic,like,~${param.topic}~)`;
    }
    if (tools.deNull(param.startman) != '') {
        whereSQL = whereSQL + `~and(sponsor,like,~${param.startman}~)`;
    }
    if (tools.deNull(param.time) != '') {
        var starttime = '';
        var endtime = '';

        //设置时间
        if (param.time.length == 0) {
            starttime = new Date();
            endtime = new Date();
        } else if (param.time.length == 1) {
            try {
                starttime = param.time[0].format('YYYY-MM-DD');
                endtime = param.time[1].format('YYYY-MM-DD');
            } catch (error) {
                starttime = param.time[0];
                endtime = param.time[1];
            }
        } else if (param.time.length >= 2) {
            try {
                starttime = param.time[0].format('YYYY-MM-DD');
                endtime = param.time[1].format('YYYY-MM-DD');
            } catch (error) {
                starttime = param.time[0];
                endtime = param.time[1];
            }
        }

        starttime = tools.formatDate(starttime, 'yyyy-MM-dd') + ' 00:00:00';
        endtime = tools.formatDate(endtime, 'yyyy-MM-dd') + ' 23:59:59';

        whereSQL = whereSQL + `~and(create_time,bw,${starttime},${endtime})`;
    }

    //查询URL
    var queryURL = `${api.restapi}/api/v_handled_events_unq?_where=(username,like,~${username}~)${whereSQL}&_p=${page}&_size=${size}&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        result = window.__.filter(result, function(item) {
            //格式化日期
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['createtime'] = tools.formatDate(
                item['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['content'] = tools.abbreviation(tools.delHtmlTag(item['content']));
            item['topic'] = tools.abbreviation(tools.delHtmlTag(item['topic']));

            //查询是否存在此用户名
            var flag = window.__.contains(item['username'], username);

            //返回结果
            return flag;
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 查询审批知会记录页面的记录
 */
export async function queryProcessLogInfApproved(username, realname, params) {
    //pageNo从0开始计算
    params.pageNo = params.pageNo - 1;

    //查询URL
    var queryURL = `${api.restapi}/api/pr_log_informed?_where=((employee,like,~${username}~)~or(employee,like,~${realname}~))&_p=${params.pageNo}&_size=${params.pageSize}&_sort=-operate_time`;
    var queryCountURL = `${api.restapi}/api/pr_log_informed/count?_where=((employee,like,~${username}~)~or(employee,like,~${realname}~))`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');

        console.log('query url : ' + queryURL);

        console.log(res);
        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;
        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLogInfByID(tableName, id) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log_informed?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryProcessLogInformed(tableName, business_data_id) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log_informed?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLog(tableName, businessID) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLogByID(tableName, id) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function deleteTableItem(tableName, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var deleteURL = '';
    //遍历node,取出里面的ids
    var ids = '';

    //如果node不是数组，则转化为数组
    if (!(node instanceof Array)) {
        node = [node];
    }

    try {
        window.__.each(node, function(item) {
            ids = ids + ',' + item['id'];
        });

        //去掉开头的逗号
        ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
    } catch (error) {
        console.log(error);
    }

    try {
        deleteURL = `${api.restapi}/api/${tableName}/bulk?_ids=${ids}`;
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function deleteProcessLog(tableName, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var deleteURL = '';
    //遍历node,取出里面的ids
    var ids = '';

    //如果node不是数组，则转化为数组
    if (!(node instanceof Array)) {
        node = [node];
    }

    try {
        window.__.each(node, function(item) {
            ids = ids + ',' + item['id'];
        });

        //去掉开头的逗号
        ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
    } catch (error) {
        console.log(error);
    }

    try {
        deleteURL = `${api.restapi}/api/pr_log/bulk?_ids=${ids}`;
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，删除到这个节点对应的流程信息
 */
export async function deleteProcessLogInf(tableName, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //遍历node,取出里面的ids
    var ids = '';
    //提交URL
    var deleteURL = '';

    //如果node不是数组，则转化为数组
    if (!(node instanceof Array)) {
        node = [node];
    }

    try {
        window.__.each(node, function(item) {
            ids = ids + ',' + item['id'];
        });

        //去掉开头的逗号
        ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
    } catch (error) {
        console.log(error);
    }

    try {
        deleteURL = `${api.restapi}/api/pr_log_informed/bulk?_ids=${ids}`;
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postTableItem(tableName, node) {
    //大写转小写
    tableName = tableName.toLowerCase();
    //提交URL
    var postURL = null;
    //是否批处理
    var bflag = node instanceof Array && node.length > 1 ? '/bulk' : '';

    //如果只有一条数据,则URL中不需要/bulk路径
    try {
        if (node instanceof Array && node.length == 1) {
            bflag = '';
            node = node[0];
        }
    } catch (error) {
        console.log(error);
    }

    //构建表单提交数据的URL
    try {
        postURL = `${api.restapi}/api/${tableName}${bflag}`;
    } catch (error) {
        console.log(error);
    }

    //发送post请求，保存数据
    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessLog(node) {
    //提交URL
    var postURL = `${api.restapi}/api/pr_log`;

    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessFreeNode(node) {
    //提交URL
    var postURL = `${api.restapi}/api/bs_free_process`;

    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessLogHistory(node) {
    //提交URL
    var postURL = null;
    //是否批处理
    var bflag = node instanceof Array && node.length > 1 ? '/bulk' : '';

    //如果只有一条数据,则URL中不需要/bulk路径
    try {
        if (node instanceof Array && node.length == 1) {
            bflag = '';
            node = node[0];
        }
    } catch (error) {
        console.log(error);
    }

    //构建流程历史表提交数据的URL
    try {
        postURL = `${api.restapi}/api/pr_log_history${bflag}`;
    } catch (error) {
        console.log(error);
    }

    //发送post请求，保存数据
    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 想知会记录列表提交数据
 */
export async function postProcessLogInformed(node) {
    //提交URL
    var postURL = null;
    //是否批处理
    var bflag = node instanceof Array && node.length > 1 ? '/bulk' : '';

    //如果只有一条数据,则URL中不需要/bulk路径
    try {
        if (node instanceof Array && node.length == 1) {
            bflag = '';
            node = node[0];
        }
    } catch (error) {
        console.log(error);
    }

    //构建知会表提交数据的URL
    try {
        postURL = `${api.restapi}/api/pr_log_informed${bflag}`;
    } catch (error) {
        console.log(error);
    }

    //发送post请求，保存数据
    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogHistoryByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log_history?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time&_p=0&_size=99`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取行政公告数据
 */
export async function queryAnnounceList(page = 0, size = 50) {

    //提交URL
    var queryURL = `${api.restapi}/api/bs_announce?_where=(bpm_status,in,4,5)&_sort=-create_time&_p=${page}&_size=${size}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        var result = res.body;

        //遍历并格式化日期
        window.__.each(result, function(item) {
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['table_name'] = 'bs_announce';
            item['content'] = item['content'] || item['title'];
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取红头文件数据
 */
export async function queryHeadList(page = 0, size = 50) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_redhead?_where=(bpm_status,in,4,5)&_sort=-create_time&_p=${page}&_size=${size}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        var result = res.body;

        //遍历并格式化日期
        window.__.each(result, function(item) {
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['table_name'] = 'bs_redhead';
            item['content'] = item['content'] || item['title'];
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取新闻资讯数据
 */
export async function queryNewsList(page = 0, size = 50) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_news?_where=(bpm_status,in,4,5)&_sort=-create_time&_p=${page}&_size=${size}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        var result = res.body;

        //遍历并格式化日期
        window.__.each(result, function(item) {
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['table_name'] = 'bs_news';
            item['content'] = item['content'] || item['title'];
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取奖罚通报数据
 */
export async function queryNoticeList(page = 0, size = 50) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_notice?_where=(bpm_status,in,4,5)&_sort=-create_time&_p=${page}&_size=${size}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        var result = res.body;

        //遍历并格式化日期
        window.__.each(result, function(item) {
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['table_name'] = 'bs_notice';
            item['content'] = item['content'] || item['title'];
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取市场观察数据
 */
export async function queryViewsList(page = 0, size = 50) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_market_info?_where=(bpm_status,in,4,5)&_sort=-create_time&_p=${page}&_size=${size}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        var result = res.body;

        //遍历并格式化日期
        window.__.each(result, function(item) {
            var optime = tools.formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            var time = tools.formatDate(item['create_time'], 'yyyyMMddhhmmss');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['timestamp'] = time;
            item['username'] = tools.deNull(item['username']).split(',');
            item['table_name'] = 'bs_market_info';
            item['content'] = item['content'] || item['title'];
        });

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 获取所有公告信息
 */
export async function queryNotifyAll(
    type = 'all',
    size = 50,
    content = '',
    starttime,
    endtime
) {
    //定义内容
    var result = [];

    //获取行政公告
    var temp = [];

    //查询结果统计数
    var length = 0;

    //格式化起始时间
    starttime = tools.isNull(starttime) ? '' : starttime.format('YYYY-MM-DD');
    endtime = tools.isNull(endtime) ? '' : endtime.format('YYYY-MM-DD');

    //遍历查询所有公告信息
    for (var i = 0; i <= 1000; i++) {
        //查询前结果
        length = result.length;

        //如果为行政公告，则合并数据
        if (type == 'all' || type == '行政公告') {
            temp = await queryAnnounceList(i, size, starttime, endtime);
            result = result.concat(temp);
        }

        //如果为红头文件，则合并数据
        if (type == 'all' || type == '红头文件') {
            temp = await queryHeadList(i, size, starttime, endtime);
            result = result.concat(temp);
        }

        //如果为新闻资讯，则合并数据
        if (type == 'all' || type == '新闻资讯') {
            temp = await queryNewsList(i, size, starttime, endtime);
            result = result.concat(temp);
        }

        //如果为奖罚通报，则合并数据
        if (type == 'all' || type == '奖罚通报') {
            temp = await queryNoticeList(i, size, starttime, endtime);
            result = result.concat(temp);
        }

        //如果为市场观察，则合并数据
        if (type == 'all' || type == '市场观察') {
            temp = await queryViewsList(i, size, starttime, endtime);
            result = result.concat(temp);
        }

        //本次查询结果数
        length = result.length - length;

        //如果最新查询结果小于等于0，则停止查询
        if (length == 0) {
            break;
        }
    }

    //遍历并筛选数据
    result = window.__.filter(result, function(item) {
        //设置数据
        var flag = true;

        //判断查询内容是否为空，不为空，则进行内容筛选
        if (!tools.isNull(content)) {
            flag =
                (flag && tools.deNull(item['title'].includes(content))) ||
                tools.deNull(item['content'].includes(content));
        }

        //判断查询时间
        if (!tools.isNull(starttime) && !tools.isNull(endtime)) {
            flag =
                flag &&
                tools.deNull(item['create_time']) >= starttime &&
                tools.deNull(item['create_time']) <= endtime;
        }

        return flag;
    });

    //遍历数据并排序
    result = window.__.sortBy(result, function(item) {
        return item['timestamp'] * -1.0;
    });

    //返回查询结果
    return result;
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogInfByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.restapi}/api/pr_log_informed?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogInfTotal(business_data_id) {
    //获取今天日期
    var ctime = tools.formatDate(new Date(), 'yyyy-MM-dd');

    //提交URL
    var queryURL = `${api.restapi}/api/pr_log_informed/count?_where=(business_data_id,eq,${business_data_id})`;
    var queryTodayURL = `${api.restapi}/api/pr_log_informed/count?_where=(business_data_id,eq,${business_data_id})~and(operate_time,like,~${ctime}~)`;
    var result = {};
    var count = 0;
    var today = 0;

    try {
        //统计知会总数
        try {
            count = await superagent.get(queryURL).set('accept', 'json');
        } catch (error) {
            console.log('query total loginfo error :' + error);
        }
        //统计当天知会次数
        try {
            today = await superagent.get(queryTodayURL).set('accept', 'json');
        } catch (error) {
            console.log('query today loginfo error :' + error);
        }
        result.total = count.body[0].no_of_rows;
        result.today = today.body[0].no_of_rows;
        console.log(result);
        return result;
    } catch (err) {
        console.log('获取某业务记录对应的审批日志信息', err);
    }
}

/**
 * @function 获取登录用户
 */
export async function queryLoginUser() {
    var queryURL = `${api.domain}/jeecg-boot/api/login/user`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.log('获取登录用户', err);
    }
}

/**
 * 获取n位随机数,随机来源chars
 */
export function queryRandomStr(n) {
    //var temp = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    var res = '';

    try {
        // var chars = temp.split(',');
        // for (var i = 0; i < n; i++) {
        //     var id = Math.ceil(Math.random() * 35);
        //     res += chars[id];
        // }

        //打印唯一字符串
        //console.log('生成随机数：' + res);

        //使用新算法，获取唯一字符串
        res = tools.queryUniqueID();
    } catch (error) {
        console.log('获取n位随机数异常：' + error);
    }

    //返回随机数
    return res;
}

/**
 * 获取n位随机数,随机来源chars
 */
export function queryRandom(n) {
    var temp =
        'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
    var res = '';

    try {
        var chars = temp.split(',');
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (temp.length - 1));
            res += chars[id];
        }
        //使用新算法，获取唯一字符串
        //res = tools.queryUniqueID();
    } catch (error) {
        console.log('获取n位随机数异常：' + error);
    }

    //返回随机数
    return res;
}

/**
 * 通过函数暴露API
 */
export function commonArgs() {
    return api;
}

/**
 * @function 查询请假类型
 */
export function queryLeaveType(leave) {
    var config = {
        affairs_leave: '事假',
        sick_leave: '病假',
        marital_leave: '婚假',
        funeral_leave: '丧假',
        maternity_leave: '产假',
        paternity_leave: '陪产假',
        annual_leave: '年假',
        wr_injury_leave: '工伤假',
        other_leave: '其他',
    };
    return config[leave];
}

/**
 * @function 查询流程状态
 */
export function queryBpmStatus(status) {
    var config = {
        '1': '待提交',
        '2': '审核中',
        '3': '审批中',
        '4': '已完成',
        '5': '已完成',
        '10': '已作废',
        '99': '已作废',
    };

    return config[status];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormName(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '请假流程申请单',
        BS_EGRESS: '外出流程申请单',
        BS_OVERTIME: '加班流程申请单',
        BS_ATTENDANCE: '考勤异常流程申请单',
        BS_RECORD_BORROW: '档案及证照借阅申请单',
        BS_SEAL_NORMAL: '用印申请流程申请单',
        BS_SEAL_CONTRACT: '用印申请流程申请单',
        BS_SEAL_DECLARE: '印章借用申请单',
        BS_TRAVEL: '出差申请单',
        BS_MARKET_INFO: '市场观察表',
        BS_NOTICE: '奖罚通报表',
        BS_NEWS: '新闻资讯表',
        BS_ANNOUNCE: '行政公告表',
        BS_REDHEAD: '红头文件表',
        BS_ISSUE: '问题反馈表',
        BS_TRAFFIC_ALLOWANCE: '车辆补贴申请表',
        BS_TRANSACTION: '流程事务处理表',
        BS_REIM: '费用报销申请表',
        BS_PURCHASE: '采购申请表',
        BS_OFFICIAL_SEAL: '用章申请表',
        BS_RESERVE: '备用金申请表',
        BS_PURCHASE_ITEM: '采购申请明细表',
        BS_MIREANNA: '物品领用表',
        BS_MIREANNA_ITEM: '物品领用明细表',
        BS_PLAN_TASK: '计划任务表',
        BS_PLAN_TASK_ITEM: '计划任务明细表',
        BS_PLAN_TASK_MISSION: '计划任务完成表',
        BS_DOCUMENT: '文档表',
        BS_DOCUMENT_ITEM: '文档明细表',
        BS_PAYMENT: '付款申请表',
        BS_REIM_ITEM: '费用报销明细表',
        BS_REPORT_JOB_LOGGING: '工作汇报表',
        BS_QUARTER_JOB_LOGGING: '季报工作记录表',
        PEAR_TEAM: '团队表',
        BS_QUESTIONS_RS: '问卷结果表',
        BS_QUESTIONS: '问卷表',
        BS_USER_INFO: '用户名册',
        BS_BLOGGER: '博主表',
        BS_REGISTOR: '花名册表',
        BS_SALARY: '工资表',
        BS_BLOG: '博文表',
        BS_COMMENTS: '评论表',
        BS_TASK_ASSIGN: '任务分配表',
        BS_DYNAMIC: '动态信息表',
        BS_TEAM: '团队表',
        BS_ABILITY_QUOTA: '综合素质指标表',
        BS_YEAR_JOB_LOGGING: '年报工作记录表',
        BS_MONTH_JOB_LOGGING: '月报工作记录表',
        BS_WEEK_JOB_LOGGING: '周报工作记录表',
        BS_FAVOR_INFO: '业务收藏表',
        BS_FREE_PROCESS: '自由流程配置表',
        PR_LOG_INFORMED: '流程审批知会表',
        PR_LOG_HISTORY: '流程审批日志历史表',
        BS_APPROVE_NODE: '流程权责审批节点表',
        BS_TASK_LOGGING: '任务管理表',
        BS_PROJECT_LOGGING: '项目管理表',
        BS_PRODUCT_LOGGING: '产品管理表',
        BS_BUG_LOGGING: 'BUG管理表',
        BS_JOB_LOGGING: '日报工作记录表',
        BS_REQUIREMENT: '需求管理表',
        BS_ATTENDANCE_DETAILS: '考勤异常明细表',
        PR_RIGHTS: '流程权限表',
        PR_TEMPLATE: '流程模板表',
        BS_APPROVE: '审批业务处理表',
        PR_LOG: '流程审批日志表'
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormTypeName(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '请假',
        BS_EGRESS: '外出',
        BS_OVERTIME: '加班',
        BS_ATTENDANCE: '考勤',
        BS_RECORD_BORROW: '借阅',
        BS_SEAL_NORMAL: '用印',
        BS_SEAL_CONTRACT: '用印',
        BS_SEAL_DECLARE: '印章',
        BS_TRAVEL: '出差',
        BS_MARKET_INFO: '公告',
        BS_NOTICE: '公告',
        BS_NEWS: '新闻',
        BS_ANNOUNCE: '公告',
        BS_REDHEAD: '红头',
        BS_ISSUE: '反馈',
        BS_TRAFFIC_ALLOWANCE: '车补',
        BS_TRANSACTION: '流程',
        BS_REIM: '报销',
        BS_PURCHASE: '采购',
        BS_OFFICIAL_SEAL: '用章',
        BS_RESERVE: '备用金',
        BS_PURCHASE_ITEM: '采购',
        BS_MIREANNA: '领用',
        BS_MIREANNA_ITEM: '领用',
        BS_PLAN_TASK: '计划',
        BS_PLAN_TASK_ITEM: '计划',
        BS_DOCUMENT: '文档',
        BS_DOCUMENT_ITEM: '文档',
        BS_PAYMENT: '付款',
        BS_REIM_ITEM: '报销',
        BS_REPORT_JOB_LOGGING: '汇报',
        BS_QUARTER_JOB_LOGGING: '季度汇报',
        PEAR_TEAM: '团队',
        BS_QUESTIONS_RS: '问卷结果',
        BS_QUESTIONS: '问卷',
        BS_USER_INFO: '名册',
        BS_BLOGGER: '博主',
        BS_REGISTOR: '名册',
        BS_SALARY: '工资',
        BS_BLOG: '博文',
        BS_COMMENTS: '评论',
        BS_TASK_ASSIGN: '任务',
        BS_DYNAMIC: '动态',
        BS_TEAM: '团队',
        BS_ABILITY_QUOTA: '指标',
        BS_YEAR_JOB_LOGGING: '年度汇报',
        BS_MONTH_JOB_LOGGING: '月度汇报',
        BS_WEEK_JOB_LOGGING: '周报',
        BS_FAVOR_INFO: '业务收藏',
        BS_FREE_PROCESS: '自由流程',
        PR_LOG_INFORMED: '流程',
        PR_LOG_HISTORY: '流程',
        BS_APPROVE_NODE: '流程',
        BS_TASK_LOGGING: '任务',
        BS_PROJECT_LOGGING: '项目',
        BS_PRODUCT_LOGGING: '产品',
        BS_BUG_LOGGING: 'BUG',
        BS_JOB_LOGGING: '日报',
        BS_REQUIREMENT: '需求',
        BS_ATTENDANCE_DETAILS: '考勤异常',
        PR_RIGHTS: '流程',
        PR_TEMPLATE: '流程模板',
        BS_APPROVE: '审批',
        PR_LOG: '流程'
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormTypeValue(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '--',
        BS_EGRESS: '普通',
        BS_OVERTIME: '普通',
        BS_ATTENDANCE: '普通',
        BS_RECORD_BORROW: '普通',
        BS_SEAL_NORMAL: '非合同',
        BS_SEAL_CONTRACT: '合同',
        BS_SEAL_DECLARE: '印章',
        BS_TRAVEL: '出差',
        BS_PLAN_TASK: '计划',
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormMainTable(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: false,
        BS_EGRESS: false,
        BS_OVERTIME: false,
        BS_ATTENDANCE: true,
        BS_RECORD_BORROW: false,
        BS_SEAL_NORMAL: false,
        BS_SEAL_CONTRACT: false,
        BS_SEAL_DECLARE: false,
        BS_TRAVEL: false,
        BS_REIM: true,
        BS_MARKET_INFO: false,
        BS_NOTICE: false,
        BS_NEWS: false,
        BS_ANNOUNCE: false,
        BS_REDHEAD: false,
        BS_ISSUE: false,
        BS_TRAFFIC_ALLOWANCE: false,
        BS_TRANSACTION: false,
        BS_PURCHASE: true,
        BS_OFFICIAL_SEAL: false,
        BS_RESERVE: false,
        BS_PURCHASE_ITEM: false,
        BS_MIREANNA: true,
        BS_MIREANNA_ITEM: false,
        BS_PLAN_TASK: true,
        BS_PLAN_TASK_ITEM: false,
        BS_DOCUMENT: true,
        BS_DOCUMENT_ITEM: false,
        BS_PAYMENT: false,
        BS_REIM_ITEM: false,
        BS_REPORT_JOB_LOGGING: false,
        BS_QUARTER_JOB_LOGGING: false,
        PEAR_TEAM: false,
        BS_QUESTIONS_RS: false,
        BS_QUESTIONS: true,
        BS_USER_INFO: false,
        BS_BLOGGER: false,
        BS_REGISTOR: false,
        BS_SALARY: false,
        BS_BLOG: false,
        BS_COMMENTS: false,
        BS_TASK_ASSIGN: false,
        BS_DYNAMIC: false,
        BS_TEAM: false,
        BS_ABILITY_QUOTA: false,
        BS_YEAR_JOB_LOGGING: false,
        BS_MONTH_JOB_LOGGING: false,
        BS_WEEK_JOB_LOGGING: false,
        BS_FAVOR_INFO: false,
        BS_FREE_PROCESS: false,
        PR_LOG_INFORMED: false,
        PR_LOG_HISTORY: false,
        BS_APPROVE_NODE: false,
        BS_TASK_LOGGING: false,
        BS_PROJECT_LOGGING: false,
        BS_PRODUCT_LOGGING: false,
        BS_BUG_LOGGING: false,
        BS_JOB_LOGGING: false,
        BS_REQUIREMENT: false,
        BS_ATTENDANCE_DETAILS: false,
        PR_RIGHTS: false,
        PR_TEMPLATE: false,
        BS_APPROVE: false,
        PR_LOG: false
    };

    return config[tableName];
}

/**
 * @function 开始日期表单显示名称
 */
export function queryFormMTStarttimeName(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '开始',
        BS_EGRESS: '开始',
        BS_OVERTIME: '开始',
        BS_ATTENDANCE: '开始',
        BS_RECORD_BORROW: '借阅',
        BS_SEAL_NORMAL: '开始',
        BS_SEAL_CONTRACT: '开始',
        BS_SEAL_DECLARE: '开始',
        BS_TRAVEL: '开始',
        BS_PLAN_TASK: '开始',
    };

    return config[tableName];
}

/**
 * @function 结束日期表单显示名称
 */
export function queryFormMTEndtimeName(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '结束',
        BS_EGRESS: '结束',
        BS_OVERTIME: '结束',
        BS_ATTENDANCE: '结束',
        BS_RECORD_BORROW: '归还',
        BS_SEAL_NORMAL: '结束',
        BS_SEAL_CONTRACT: '结束',
        BS_SEAL_DECLARE: '结束',
        BS_TRAVEL: '结束',
        BS_PLAN_TASK: '结束',
    };

    return config[tableName];
}

/**
 * @function 结束日期表单显示名称
 */
export function queryFormMTFileName(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_LEAVE: '文件名称',
        BS_EGRESS: '文件名称',
        BS_OVERTIME: '文件名称',
        BS_ATTENDANCE: '文件名称',
        BS_RECORD_BORROW: '档案资料',
        BS_SEAL_NORMAL: '文件名称',
        BS_SEAL_CONTRACT: '文件名称',
        BS_SEAL_DECLARE: '文件名称',
        BS_TRAVEL: '文件名称',
    };

    return config[tableName];
}

/**
 * @function 查询附表字段
 */
export function queryFormMTSubColumns(tableName) {
    //大写转小写
    tableName = tableName.toUpperCase();
    //配置说明
    var config = {
        BS_ATTENDANCE: [{
                title: '序号',
                dataIndex: 'no',
                width: '10%',
                align: 'center',
            },
            {
                title: '异常时间',
                dataIndex: 'adate',
                width: '35%',
                align: 'center',
            },
            {
                title: '异常类型',
                dataIndex: 'type',
                width: '20%',
                align: 'center',
            },
            {
                title: '异常说明',
                dataIndex: 'content',
                width: '35%',
                align: 'left',
            },
        ],
        BS_REIM: [{
                title: "序号",
                dataIndex: "no",
                width: '10%',
                align: 'center',
            },
            {
                title: '内容',
                dataIndex: 'content',
                width: '50%',
                align: 'center',
            },
            {
                title: '日期',
                dataIndex: 'date',
                width: '20%',
                align: 'center',
            },
            {
                title: '金额',
                dataIndex: 'money',
                width: '20%',
                align: 'center',
            },
        ],
        BS_PURCHASE: [{
                title: "序号",
                dataIndex: "no",
                width: '10%',
                align: 'center',
            },
            {
                title: "名称",
                dataIndex: "name",
                width: '10%',
                align: 'center',
            },
            {
                title: "规格",
                dataIndex: "eritelmat",
                width: '10%',
                align: 'center',
            },
            {
                title: "数量",
                dataIndex: "amount",
                width: '10%',
                align: 'center',
            },
            {
                title: "金额",
                dataIndex: "money",
                width: '10%',
                align: 'center',
            },
        ],
        BS_MIREANNA: [{
                title: "序号",
                dataIndex: "no",
                width: '10%',
                align: 'center',
            },
            {
                title: "名称",
                dataIndex: "name",
                width: '30%',
                align: 'center',
            },
            {
                title: "金额",
                dataIndex: "amount",
                width: '30%',
                align: 'center',
            },
        ],
        BS_PLAN_TASK: [{
                title: "任务编号",
                dataIndex: "pid",
                width: '8%',
                align: 'center',
            },
            {
                title: "任务标题",
                dataIndex: "task_title",
                width: '25%',
                align: 'center',
            },
            {
                title: "开始时间",
                dataIndex: "start_time",
                width: '10%',
                align: 'center',
            },
            {
                title: "结束时间",
                dataIndex: "end_time",
                width: '10%',
                align: 'center',
            },
            {
                title: "实际开始",
                dataIndex: "real_start_time",
                width: '10%',
                align: 'center',
            },
            {
                title: "实际结束",
                dataIndex: "real_end_time",
                width: '10%',
                align: 'center',
            },
            {
                title: "分配对象",
                dataIndex: "create_by",
                width: '10%',
                align: 'center',
            },
            {
                title: "执行人员",
                dataIndex: "task_exector",
                width: '10%',
                align: 'center',
            },
            {
                title: "完成状态",
                dataIndex: "status",
                width: '10%',
                align: 'center',
            },
        ],
    };

    return config[tableName];
}

/**
 * @function 查询附表数据
 */
export async function queryFormMTSubData(tableName, foreignKey, id) {
    //大写转小写
    tableName = tableName.toUpperCase();

    //配置说明
    var config = {
        BS_LEAVE: [],
        BS_EGRESS: [],
        BS_OVERTIME: [],
        BS_ATTENDANCE: [],
        BS_RECORD_BORROW: [],
        BS_SEAL_NORMAL: [],
        BS_SEAL_CONTRACT: [],
        BS_SEAL_DECLARE: [],
        BS_TRAVEL: [],
        BS_REIM: [],
        BS_PURCHASE: [],
        BS_MIREANNA: [],
        BS_PLAN_TASK: [],
        BS_DOCUMENT: []
    };

    //表单配置
    var tableConfig = {
        'BS_ATTENDANCE': 'BS_ATTENDANCE_DETAILS',
        'BS_REIM': 'BS_REIM_ITEM',
        'BS_PURCHASE': 'BS_PURCHASE_ITEM',
        'BS_MIREANNA': 'BS_MIREANNA_ITEM',
        'BS_PLAN_TASK': 'BS_PLAN_TASK_ITEM',
        'BS_DOCUMENT': 'BS_DOCUMENT_ITEM'
    }

    //设置返回数据
    var data = [];

    //定义执行标识
    var cflag = false;

    //检查是否存在表单
    try {
        cflag = ['BS_ATTENDANCE', 'BS_REIM', 'BS_PURCHASE', 'BS_MIREANNA', 'BS_PLAN_TASK', 'BS_DOCUMENT'].includes(tableName);
    } catch (error) {
        console.error(error);
    }

    //查询主表的子表信息
    if (cflag) {
        try {
            debugger;
            //查询子表单数据
            try {
                data = await queryTableDataByField(
                    tableConfig[tableName],
                    foreignKey,
                    id
                );
            } catch (error) {
                console.log('查询子表单数据异常：' + error);
            }
            //遍历子表单数据并设置序号
            try {
                data.forEach(function(item, index) {
                    try {
                        item.no = index + 1;
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.date = tools.formatDate(item.date, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.start_time = tools.formatDate(item.start_time, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.end_time = tools.formatDate(item.end_time, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.real_start_time = tools.formatDate(item.real_start_time, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.real_end_time = tools.formatDate(item.real_end_time, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.work_date = tools.formatDate(item.work_date, 'yyyy-MM-dd');
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        item.status = /^[0-9]*$/.test(item.status) ? queryBpmStatus(item.status) : item.status;
                    } catch (error) {
                        console.error(error);
                    }
                });
            } catch (error) {
                console.log('子表单设置序号异常：' + error);
            }
            //设置子表单数据
            config[tableName] = data;
        } catch (error) {
            console.log('查询子表信息异常：' + error);
        }
    }
    //返回考勤异常表的子表信息
    return config[tableName];
}

/**
 * @function 查询用户的真实姓名
 */
export function queryUserRealName(name) {
    //查询用户信息
    var userlist = queryUserNameByCache();
    var user = '';

    try {
        //如果用户信息不存在，则直接返回，否则，查询用户的真实名称
        if (
            typeof userlist == 'undefined' ||
            userlist == null ||
            userlist.length == 0
        ) {
            return user;
        } else {
            if (name.includes(',')) {
                var ulist = name.split(',');
                window.__.each(ulist, item => {
                    //查询用户信息
                    var obj = window.__.find(userlist, user => {
                        return user.username == item;
                    });
                    user = user + ',' + obj.realname;
                });

                //如果是逗号开头，则去掉第一个字符
                if (user.startsWith(',')) {
                    user = user.substring(1);
                }
            } else {
                //查询用户信息
                user = window.__.find(userlist, user => {
                    return user.username == name;
                });

                if (typeof user.realname != 'undefined' && user.realname != '') {
                    user = user.realname;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
    return user;
}

/**
 * @function 查询表单对应的历史自由流程
 */
export async function queryHisFreeWorkflow(id) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_free_process?_where=(main_key,eq,${id})&_sort=-create_time`;
    //根据业务编号，查询业务数据
    var wflist = [];

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //如果只有一条数据，则返回[]；如果有多条数据，则返回多个数据
        if (typeof res.body == 'undefined' || res.body == null || res.body == '') {
            wflist = [];
        } else if (res.body.length == 1) {
            wflist = [];
        } else {
            wflist = res.body.splice(1);
        }
    } catch (err) {
        console.log(err);
    }

    return wflist;
}

/**
 * @function 查询表单对应的历史自由流程
 */
export async function queryCurFreeWorkflow(id) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_free_process?_where=(main_key,eq,${id})&_sort=-create_time`;
    //根据业务编号，查询业务数据
    var wflow = [];

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //如果只有一条数据，则返回[]；如果有多条数据，则返回多个数据
        if (
            typeof res.body == 'undefined' ||
            res.body == null ||
            res.body == '' ||
            res.body.length == 0
        ) {
            wflow = null;
        } else if (res.body.length >= 1) {
            wflow = res.body[0];
        }
    } catch (err) {
        console.log(err);
    }

    return wflow;
}

/**
 * @function 查询当前评论信息
 */
export async function queryCurReplayList(id) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_comments?_where=(main_key,eq,${id})&_sort=create_time`;
    //根据业务编号，查询业务数据
    var wflow = [];

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //如果只有一条数据，则返回[]；如果有多条数据，则返回多个数据
        if (
            typeof res.body == 'undefined' ||
            res.body == null ||
            res.body == '' ||
            res.body.length == 0
        ) {
            wflow = [];
        } else if (res.body.length >= 1) {
            wflow = res.body;
        }

        //遍历数据，格式化日期
        for (var item of wflow) {
            item['create_time'] = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            item['replay'] = JSON.parse(item['replay']);
        }
    } catch (err) {
        console.log(err);
    }

    return wflow;
}

/**
 * @function 查询审批流程信息
 */
export async function queryWorkflows(business_data_id) {
    //待返回审批流程数据
    var workflows = null;

    //从浏览器缓存中获取审批日志数据
    try {
        workflows = storage.getStore(`workflows_by_data_id@${business_data_id}`);
    } catch (error) {
        console.log('query store info of workflows error :' + error);
    }

    //没有从缓存中获取到审批日志信息，则从数据中获取数据
    if (
        workflows == null ||
        workflows == '' ||
        typeof workflows == 'undefined' ||
        workflows.length == 0
    ) {
        //流程数据设置为数组
        workflows = [];

        //获取审批日志信息
        var processLogs = {};

        try {
            //查询审批日志信息
            processLogs = await queryPRLogHistoryByDataID(business_data_id);

            //遍历审批日志
            window.__.each(processLogs, (item, index) => {
                //获取下一节点
                var next =
                    index < processLogs.length - 1 ?
                    processLogs[index + 1] : {
                        action: '',
                    };
                //获取标识
                var flag = index == processLogs.length - 1;
                //获取操作时间
                var optime = tools.formatDate(
                    new Date(item.operate_time),
                    'yyyy-MM-dd hh:mm:ss'
                );

                var content = `节点：${tools.deNull(
          item.process_station
        )} , 处理人： ${tools.deNull(
          queryUserRealName(item.approve_user)
        )} , 审批：${tools.deNull(item.action)} , 审批意见：${tools.deNull(
          item.action_opinion
        )}  时间：${tools.deNull(optime)} `;

                var color =
                    item.action == '同意' ?
                    'green' :
                    item.action == '驳回' || item.action == '撤销' ?
                    'red' :
                    item.action == '知会' ?
                    'yellow' :
                    item.action == '发起' ?
                    '#00DD77' :
                    'blue';

                //默认认为最靠近知会的节点为审批节点，颜色标识为蓝色
                color = item.action == '同意' && next.action == '知会' ? 'blue' : color;
                color = flag && item.action == '同意' ? 'blue' : color;
                color = flag && item.action == '知会' ? 'orange' : color;

                var status =
                    (item.action == '同意' && next.action == '知会') ||
                    (flag && item.action == '同意') ?
                    'over' :
                    item.action == '发起' ?
                    'start' :
                    item.action == '同意' ?
                    'agree' :
                    item.action == '驳回' || item.action == '撤销' ?
                    'cancel' :
                    item.action == '知会' ?
                    'message' :
                    'over';

                var node = {
                    id: item.id,
                    color: color,
                    content: content,
                    status: status,
                };

                workflows.push(node);
            });
        } catch (error) {
            console.log('获取已处理的审批日志信息异常 :' + error);
        }

        try {
            //最后一条审核节点
            var auditnode = {};
            //获取正在审批的审批日志信息
            processLogs = await queryPRLogByDataID(business_data_id);

            //遍历数据
            window.__.each(processLogs, (item, index) => {
                var node = {
                    id: item.id,
                    employee: item.employee,
                    color: 'pink',
                    content: `节点：${tools.deNull(
            item.process_station
          )} , 待处理人： ${tools.deNull(
            queryUserRealName(item.employee)
          )} , 审批：待处理 , 时间：-- `,
                    status: 'wait',
                    index: index,
                };
                workflows.push(node);
                //设置最后一条审核节点
                auditnode = node;
            });

            //获取正在审批的最后一条数据
            storage.setStore(
                `workflows_audit_node_by_data_id@${business_data_id}`,
                JSON.stringify(auditnode),
                60
            );
        } catch (error) {
            console.log('获取正在审批的审批日志信息失败 :' + error);
        }

        try {
            //最后一条知会节点
            var notifynode = {};
            //获取正在审批的知会日志信息
            processLogs = await queryPRLogInfByDataID(business_data_id);

            window.__.each(processLogs, (item, index) => {
                //获取操作时间
                var optime = tools.formatDate(
                    new Date(item.operate_time),
                    'yyyy-MM-dd hh:mm:ss'
                );
                var appruser = tools.deNull(item.approve_user);
                var node = {
                    id: item.id,
                    employee: item.employee,
                    appruser: appruser,
                    color: 'orange',
                    content: `节点：${tools.deNull(
            item.process_station
          )} , 待处理人： ${tools.deNull(
            queryUserRealName(item.employee)
          )} ,  已处理人： ${tools.deNull(
            queryUserRealName(appruser)
          )} , 审批：知会 , 时间：${tools.deNull(optime)} `,
                    status: 'sound',
                    index: index,
                };
                workflows.push(node);
                //设置最后一条知会节点
                notifynode = node;
            });

            //获取知会的最后一条数据
            storage.setStore(
                `workflows_notify_node_by_data_id@${business_data_id}`,
                JSON.stringify(notifynode),
                60
            );
        } catch (error) {
            console.log('获取正在审批的知会日志信息异常：' + error);
        }

        try {
            storage.setStore(
                `workflows_by_data_id@${business_data_id}`,
                JSON.stringify(workflows),
                10
            );
        } catch (error) {
            console.log('save workflows data error :' + error);
        }
    }

    //返回工作流程数据
    return workflows;
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryDepartNameByCode(code) {
    //提交URL
    var queryURL = `${api.restapi}/api/sys_depart?_where=(org_code,eq,${code})`;
    //根据部门编号，查询部门信息
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询表单详情页面
 */
export async function watchFormLeave(that) {
    //显示提示信息
    var path = window.location.href.split(window.location.host)[1];
    //获取部门信息
    var department = '';
    //获取对应表单信息
    var tableName = tools.queryUrlString('table_name');
    //查询主键ID
    var id = tools.queryUrlString('id');
    //获取用户名称
    var username = tools.queryUrlString('user');

    //如果不是表单详情页面，则直接返回
    if (!(path.includes('/workflow/view') || path.includes('/basewflow/view'))) {
        return false;
    }

    try {
        //查询表单信息
        that.formName = queryFormName(tableName);
        //查询用户名称信息
        that.username = username;
    } catch (error) {
        console.log('query base info error :' + error);
    }

    try {
        //查询对应表单数据
        that.curRow = await queryTableData(tableName, id);
    } catch (error) {
        console.log('query cur row info error :' + error);
    }

    //此表单数据已经被删除，无法查看
    if (typeof that.curRow == 'undefined' || that.curRow == null) {
        try {
            //提示信息
            var message = '此表单数据已经被删除，无法查看此数据！';
            //当前审批流程相关信息转历史记录
            var result = await transWflowToHistory(tableName, id);

            //显示并确认提示信息
            that.$confirm_({
                title: '提示',
                content: message,
                onOk: function() {
                    //关闭当前Tab页面
                    that.$root.$tabs.closeTab(path);
                },
            });
            console.log('此表单数据已经被删除，无法查看此数据，result :' + result);
        } catch (error) {
            console.log('message confirm error :' + error);
        }
        return false;
    }

    try {
        department = await queryTableData(
            'sys_depart',
            that.curRow.department ||
            that.curRow.depart_name ||
            that.curRow.sys_org_code
        );
    } catch (error) {
        console.log('query department error :' + error);
    }

    //如果没查询到部门信息，则通过org_code字段查询部门信息
    try {
        department =
            department || (await queryDepartNameByCode(that.curRow.sys_org_code));
        //部门信息
        //that.curRow.depart_name = department;
    } catch (error) {
        console.log('query department error :' + error);
    }

    try {
        //查询审批流程信息
        that.workflows = await queryWorkflows(that.curRow.id);
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        that.curRow.leave_type_name =
            queryLeaveType(that.curRow.leave_off_type) ||
            queryFormTypeValue(tableName);
        //查询当前流程状态
        that.curRow.bpm_status_name = queryBpmStatus(that.curRow.bpm_status);
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询申请开始日期
        that.curRow.starttime = tools.formatDate(
            that.curRow.starttime,
            'yyyy-MM-dd hh:mm:ss'
        );

        //如果未查询到开始日期，则使用申请日期
        if (that.curRow.starttime == '--') {
            that.curRow.starttime = tools.formatDate(
                that.curRow.create_time,
                'yyyy-MM-dd hh:mm:ss'
            );
        }
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询申请结束日期
        that.curRow.endtime = tools.formatDate(
            that.curRow.endtime,
            'yyyy-MM-dd hh:mm:ss'
        );
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询申请创建日期
        that.curRow.create_time = tools.formatDate(
            that.curRow.create_time,
            'yyyy-MM-dd'
        );

        //查询采购交付日期
        that.curRow.purchase_date = tools.formatDate(that.curRow.purchase_date, 'yyyy-MM-dd');

        //设置申请日期
        that.curRow.apply_date = tools.formatDate(that.curRow.apply_date, 'yyyy-MM-dd');

        //设置归还日期
        that.curRow.pay_back_date = tools.formatDate(that.curRow.pay_back_date, 'yyyy-MM-dd');

        //设置支付日期
        that.curRow.pay_date = tools.formatDate(that.curRow.pay_date, 'yyyy-MM-dd');

        //设置开始日期
        that.curRow.start_time = tools.formatDate(that.curRow.start_time, 'yyyy-MM-dd');

        //设置结束日期
        that.curRow.end_time = tools.formatDate(that.curRow.end_time, 'yyyy-MM-dd');

        //设置开始日期
        that.curRow.real_start_time = tools.formatDate(that.curRow.start_time, 'yyyy-MM-dd');

        //设置结束日期
        that.curRow.real_end_time = tools.formatDate(that.curRow.end_time, 'yyyy-MM-dd');

        //设置工作日期
        that.curRow.work_date = tools.formatDate(that.curRow.work_date, 'yyyy-MM-dd');

        //设置汇报日期
        that.curRow.report_date = tools.formatDate(that.curRow.report_date, 'yyyy-MM-dd');

    } catch (error) {
        console.error(error);
    }

    try {
        //查询表单类型名称
        that.curRow.formTypeName = queryFormTypeName(tableName);
        //查询日期之间的天数
        // that.curRow.total_days = queryDateDiff(
        //     that.curRow.starttime,
        //     that.curRow.endtime
        // );
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询此表单是否为主表单
        that.curRow.main_table_status = queryFormMainTable(tableName);
        //查询此表单的附表字段
        that.curRow.sub_columns = queryFormMTSubColumns(tableName);
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询此表单的附表数据
        that.curRow.sub_data = await queryFormMTSubData(
            tableName,
            'foreign_key_id',
            id
        );
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询结束时间表单显示名称
        that.curRow.startTimeName = queryFormMTStarttimeName(tableName) || '开始';
        //查询结束时间表单显示名称
        that.curRow.endTimeName = queryFormMTEndtimeName(tableName) || '结束';
        //查询文件名称显示标题
        that.curRow.fileNameTitle = queryFormMTFileName(tableName) || '文件名称';
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询字段中文名称
        that.curRow.fieldName = {};
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询工作流程状态
        that.wflowstatus = await queryWorkflowStatus(tableName, id);
    } catch (error) {
        console.log('query workflow status error :' + error);
    }

    try {
        //设置字段名称
        var filedValue = await queryTableFieldInfo(
            'v_table_field',
            tableName,
            'file_name'
        );

        //设置字段名称
        if (typeof filedValue != 'undefined') {
            that.curRow.fieldName['file_name'] = filedValue['txt'];
        }
    } catch (error) {
        console.log('setup fieldName info error :' + error);
    }

    try {
        that.depart = department;
        that.curRow.depart_name = department.depart_name;
    } catch (error) {
        console.log('setup department error : ' + error);
    }

    return that;
}

/**
 * @function 知会/流程通知转移到历史记录中
 */
export async function transWflowToHistory(tableName, id) {
    //定义返回结果
    var result = null;
    //执行转历史操作
    try {
        //对应表单没有数据，故此知会/流程通知转移到历史记录中，获取关于此表单的所有当前审批日志信息
        var wfnode = await queryProcessLog(tableName, id);
        //对应表单没有数据，故此知会/流程通知转移到历史记录中，获取关于此表单的所有当前知会日志信息
        var messageNode = await queryProcessLogInformed(tableName, id);
        //如果审批日志信息不为空，则将审批日志信息转化为历史数据
        if (tools.deNull(wfnode) != '') {
            result = await transWflowHistoring(tableName, wfnode);
        }
        //如果知会日志信息不为空，则将知会日志信息转化为历史数据
        if (tools.deNull(messageNode) != '') {
            result = await transWflowHistoring(tableName, messageNode);
        }
    } catch (error) {
        console.log(error);
    }
    //返回结果
    return result;
}

/**
 * @function 知会/流程通知转移到历史记录的子操作
 */
export async function transWflowHistoring(tableName, wfnode) {
    //定义返回结果
    var result = null;

    try {
        //删除当前审批节点中的所有记录
        result = await deleteProcessLog(tableName, wfnode);
        result = await deleteProcessLogInf(tableName, wfnode);
    } catch (error) {
        console.log(error);
    }

    try {
        //如果是数组，则遍历并转历史，如果是对象，则直接转历史
        if (wfnode instanceof Array && wfnode.length > 0) {
            for (const item of wfnode) {
                //转化日期格式
                item['operate_time'] = tools.formatDate(
                    item['operate_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                item['create_time'] = tools.formatDate(
                    item['create_time'],
                    'yyyy-MM-dd hh:mm:ss'
                );
                //将当前审批日志转为历史日志，并删除当前审批日志中相关信息
                result = await postProcessLogHistory(item);
            }
        } else {
            //转化日期格式
            wfnode['operate_time'] = tools.formatDate(
                wfnode['operate_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            wfnode['create_time'] = tools.formatDate(
                wfnode['create_time'],
                'yyyy-MM-dd hh:mm:ss'
            );
            //将当前审批日志转为历史日志，并删除当前审批日志中相关信息
            result = await postProcessLogHistory(wfnode);
        }
    } catch (error) {
        console.log(error);
    }

    //返回结果
    return result;
}

/**
 * @function 查询文档对应预览地址
 * @param {*} text
 */
export async function queryFileViewURL(text) {
    //文档URL
    var url = '';

    //查询文档对应预览地址
    try {
        //获取小写文档下载地址
        var textURL = tools.deNull(text).toLowerCase();
        //如果不含有office文档
        if (!(
                textURL.includes('doc') ||
                textURL.includes('ppt') ||
                textURL.includes('xls') ||
                textURL.includes('pdf')
            )) {
            return false;
        }

        //文档数组
        var fileList = [];

        if (text.indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }

        //获取第一个office文档
        url = window.__.find(fileList, function(text) {
            //获取小写字符串
            text = tools.deNull(text).toLowerCase();
            return (
                text.includes('doc') ||
                text.includes('ppt') ||
                text.includes('xls') ||
                text.includes('pdf')
            );
        });

        //文档预览URL
        var previewURL = window._CONFIG['viewURL'];

        //文档下载地址
        url = window._CONFIG['downloadURL'] + '/' + url;
        //暂存文档地址
        var tempUrl = `${url}`;

        //URL加密，保证中文路径可以被正常解析
        var xurl = url.replace('files/', 'files/convert/');
        //去掉后缀
        xurl = xurl.substring(0, xurl.lastIndexOf('.'));

        //获取文件后缀
        var suffix = tools
            .deNull(url)
            .substring(url.lastIndexOf('.'), url.length)
            .toLowerCase();

        //如果word文档，则使用微软API打开
        url = tools.deNull(suffix).includes('xls') ? xurl + '.html' : url;
        //如果word文档，则使用微软API打开
        url =
            tools.deNull(suffix).includes('doc') ||
            tools.deNull(suffix).includes('ppt') ||
            tools.deNull(suffix).includes('pdf') ?
            xurl + '.pdf' :
            url;

        //待检测URL
        var checkURL = decodeURIComponent(url);

        //打印checkURL
        console.log('checkURL :' + checkURL);

        //设置加密路径
        xurl = encodeURIComponent(xurl);

        //如果word文档，则使用微软API打开
        url =
            tools.deNull(suffix).includes('doc') ||
            tools.deNull(suffix).includes('ppt') ||
            tools.deNull(suffix).includes('pdf') ?
            previewURL + xurl + '.pdf' :
            url;

        //检测文件URL标识
        var existFlag = await queryUrlValid(checkURL);

        //如果文件地址不存在，则使用kkfileview预览模式
        if (!existFlag) {
            url = window._CONFIG['previewURL'] + tempUrl;
            console.log('地址不存在：' + url);
        }

        //打印预览地址日志
        console.log('preview url :' + url);
    } catch (error) {
        //打印错误日志
        console.log('query file view url error :' + error);
    }

    //返回URL
    return url;
}

/**
 * @function 查询文件类型
 * @description 查询表单含有的文件的文档类型
 * @param {*} text
 */
export function queryFileType(text) {
    //文档类型
    var type = '';
    //文件后缀
    var suffix = '';

    try {
        //获取文件后缀
        suffix = tools.deNull(text).toLowerCase();
    } catch (error) {
        suffix = `${text}`;
    }

    try {
        //如果office文档，则使用微软API打开
        type =
            suffix.includes('jpg') ||
            suffix.includes('jpeg') ||
            suffix.includes('bmp') ||
            suffix.includes('gif') ||
            suffix.includes('webp') ||
            suffix.includes('svg') ||
            suffix.includes('png') ?
            '@image@' :
            '';

        type =
            suffix.includes('doc') ||
            suffix.includes('xls') ||
            suffix.includes('ppt') ||
            suffix.includes('pdf') ?
            `${type}@office@` :
            type;
    } catch (error) {
        console.log('query file type error :' + error);
    }

    //打印文档URL
    console.log('url type :' + type);

    //返回URL
    return type;
}

/**
 * @function 查询附件中的图片地址
 */
export function queryImageURL(text) {
    //文档数组
    var fileList = [];
    var images = [];

    try {
        //如果text为空，则返回空数组
        if (tools.deNull(text) == '') {
            return [];
        }
        //如果含有多个地址，则split后获取数组
        if (tools.deNull(text).indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }
    } catch (error) {
        console.log('query image url error :' + error);
    }

    try {
        //遍历并筛选出里面的图片信息
        fileList = window.__.filter(fileList, function(text) {
            //获取小写后的路径
            var ptext = tools.deNull(text).toLowerCase();

            //获取图片标识
            var flag =
                ptext.includes('jpg') ||
                ptext.includes('jpeg') ||
                ptext.includes('bmp') ||
                ptext.includes('gif') ||
                ptext.includes('webp') ||
                suffix.includes('svg') ||
                ptext.includes('png');

            //获取文件后缀
            var suffix = tools
                .deNull(ptext)
                .substring(ptext.lastIndexOf('.'), ptext.length)
                .toLowerCase();

            //定义压缩图片URL
            var thumborURL = text
                .replace('files/', 'files/images/')
                .replace(suffix, '_S240x160' + suffix);

            //获取图片真实下载地址 在线压缩地址：window._CONFIG['thumborURL'] + encodeURIComponent(text)  离线压缩地址：text.replace('files/', 'files/images/').replace(suffix,'_S240x160'+suffix)
            text =
                window._CONFIG['downloadURL'] +
                '/' +
                text.replace('files/', 'files/origin/');
            //获取压缩图片地址
            thumborURL = window._CONFIG['downloadURL'] + '/' + thumborURL;
            //图片预加载地址
            ptext = thumborURL;
            //获取在线裁剪预览地址
            thumborURL =
                window._CONFIG['thumborURL'] + encodeURIComponent(thumborURL);

            //动态加载图片，并计算图片高宽比
            var img = new Image();
            img.src = ptext;
            img.onload = () => {
                //如果文件路径为图片地址，则存入images中
                if (flag) {
                    //将数据存入images中
                    images.push({
                        src: text,
                        msrc: thumborURL,
                        title: '图片预览',
                        w: 900,
                        h: (900 * img.height) / img.width,
                    });
                }
            };

            return flag;
        });
    } catch (error) {
        console.log('query image url error :' + error);
    }

    //返回图片数组信息
    return images;
}

/**
 * @function 查询附件中的视频地址
 */
export function queryVideoURL(text) {
    //文档数组
    var fileList = [];
    var images = [];

    try {
        //如果text为空，则返回空数组
        if (tools.deNull(text) == '') {
            return [];
        }
        //如果含有多个地址，则split后获取数组
        if (tools.deNull(text).indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }
    } catch (error) {
        console.log('query image url error :' + error);
    }

    try {
        //遍历并筛选出里面的图片信息
        fileList = window.__.filter(fileList, function(text) {
            //获取小写后的路径
            var ptext = tools.deNull(text).toLowerCase();

            //获取图片标识
            var flag =
                ptext.includes('mp4') || ptext.includes('flv') || ptext.includes('avi');

            //获取文件后缀
            var suffix = tools
                .deNull(ptext)
                .substring(ptext.lastIndexOf('.'), ptext.length)
                .toLowerCase();

            //获取图片真实下载地址 在线压缩地址：window._CONFIG['thumborURL'] + encodeURIComponent(text)  离线压缩地址：text.replace('files/', 'files/images/').replace(suffix,'_S240x160'+suffix)
            text =
                window._CONFIG['downloadURL'] + '/' + text.replace('files/', 'files/');

            //如果文件路径为图片地址，则存入images中
            if (flag) {
                //将数据存入images中
                images.push(text);
            }

            return flag;
        });
    } catch (error) {
        console.log('query image url error :' + error);
    }

    //返回图片数组信息
    return images;
}

/**
 * @function 获取博文信息
 */
export async function queryBloggerInfo(username, result) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_blog/groupby?_fields=create_by,page_type`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //查找作者的原创博文数量
        result = window.__.find(res.body, function(item) {
            return item.create_by == username && item.page_type == 'Y';
        });

        return result._count || 0;
    } catch (err) {
        console.log(err);

        return 0;
    }
}

/**
 * @function 查询工资表单信息
 */
export async function queryWageByParam(
    username = '',
    params = '',
    page = 0,
    size = 50,
    result = ''
) {
    //条件SQL
    var whereSQL = '';

    try {
        //根据条件构造参数
        if (tools.deNull(params.name) != '') {
            whereSQL = whereSQL + `~and(name,eq,${params.name})`;
        }
    } catch (error) {
        console.error(error);
    }

    try {
        //检查查询条件中是否含有时间
        if (tools.deNull(params.time) != '') {
            var starttime = '';
            var endtime = '';

            //设置时间
            if (params.time.length == 0) {
                starttime = new Date();
                endtime = new Date();
            } else if (params.time.length == 1) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = new Date();
                } catch (error) {
                    starttime = params.time[0];
                    endtime = new Date();
                }
            } else if (params.time.length >= 2) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = params.time[1].format('YYYY-MM-DD');
                } catch (error) {
                    starttime = params.time[0];
                    endtime = params.time[1];
                }
            }

            starttime = tools.formatDate(starttime, 'yyyy-MM-dd') + ' 00:00:00';
            endtime = tools.formatDate(endtime, 'yyyy-MM-dd') + ' 23:59:59';

            whereSQL = whereSQL + `~and(pay_wages_date,bw,${starttime},${endtime})`;
        }
    } catch (error) {
        console.error(error);
    }

    //提交URL
    var queryURL = `${api.restapi}/api/bs_salary?_where=(id,ne,'')${whereSQL}&_p=${page}&_size=${size}&_sort=-wages_date`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //遍历所有数据，设置日期格式
        result = window.__.filter(res.body, item => {
            //日期格式化操作
            item['wages_date'] = tools.formatDate(item['wages_date'], 'yyyy-MM-dd');
            item['join_time'] = tools.formatDate(item['join_time'], 'yyyy-MM-dd');

            //遍历对象属性
            for (let key of Object.keys(item)) {
                //获取属性的值
                var value = item[key];
                //如果是数字类型，则保留两位小数
                if (typeof value == 'number') {
                    item[key] = value.toFixed(2);
                }
            }

            return true;
        });

        return result;
    } catch (err) {
        console.log(err);

        return 0;
    }
}

/**
 * @function 查询工资表单信息
 */
export async function queryWageBillByParam(
    username = '',
    params = '',
    page = 0,
    size = 50,
    result = ''
) {

    //条件SQL
    var whereSQL = '';

    try {
        //根据条件构造参数
        if (tools.deNull(params.name) != '') {
            whereSQL = whereSQL + `~and(name,eq,${params.name})`;
        }
    } catch (error) {
        console.error(error);
    }

    try {
        //检查查询条件中是否含有时间
        if (tools.deNull(params.time) != '') {
            var starttime = '';
            var endtime = '';

            //设置时间
            if (params.time.length == 0) {
                starttime = new Date();
                endtime = new Date();
            } else if (params.time.length == 1) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = new Date();
                } catch (error) {
                    starttime = params.time[0];
                    endtime = new Date();
                }
            } else if (params.time.length >= 2) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = params.time[1].format('YYYY-MM-DD');
                } catch (error) {
                    starttime = params.time[0];
                    endtime = params.time[1];
                }
            }

            starttime = tools.formatDate(starttime, 'yyyy-MM-dd') + ' 00:00:00';
            endtime = tools.formatDate(endtime, 'yyyy-MM-dd') + ' 23:59:59';

            whereSQL = whereSQL + `~and(pay_wages_date,bw,${starttime},${endtime})`;
        }
    } catch (error) {
        console.error(error);
    }

    //提交URL
    var queryURL = `${api.restapi}/api/bs_salary?_where=(id,ne,'')${whereSQL}&_p=${page}&_size=${size}&_sort=-wages_date`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //遍历所有数据，设置日期格式
        result = window.__.filter(res.body, item => {
            //日期格式化操作
            item['wages_date'] = tools.formatDate(item['wages_date'], 'yyyy-MM-dd');
            item['join_time'] = tools.formatDate(item['join_time'], 'yyyy-MM-dd');

            //遍历对象属性
            for (let key of Object.keys(item)) {
                //获取属性的值
                var value = item[key];
                //如果是数字类型，则保留两位小数
                if (typeof value == 'number') {
                    item[key] = value.toFixed(2);
                }
            }

            return true;
        });

        return result;
    } catch (err) {
        console.log(err);

        return 0;
    }
}


/**
 * @function 查询工资信息
 */
export async function queryWageByUserName(
    realname = '',
    username = '',
    page = 0,
    size = 50,
    result = ''
) {

    //提交URL
    var queryURL = `${api.restapi}/api/bs_salary?_where=(name,eq,${realname})~or(username,eq,${username})&_p=${page}&_size=${size}`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //遍历所有数据，设置日期格式
        result = window.__.filter(res.body, item => {
            //日期格式化操作
            //item['create_time'] = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            item['join_time'] = tools.formatDate(item['join_time'], 'yyyy-MM-dd');

            //遍历对象属性
            for (let key of Object.keys(item)) {
                //获取属性的值
                var value = item[key];
                //如果是数字类型，则保留两位小数
                if (typeof value == 'number') {
                    item[key] = value.toFixed(2);
                }
            }

            return true;
        });

        return result[0];
    } catch (err) {
        console.log(err);

        return 0;
    }
}


/**
 * @function 查询花名册信息
 */
export async function queryRegisterByUserName(
    realname = '',
    username = '',
    page = 0,
    size = 50,
    result = ''
) {
    //提交URL
    var queryURL = `${api.restapi}/api/bs_user_info?_where=(name,eq,${realname})~or(username,eq,${username})&_p=${page}&_size=${size}&_sort=-join_time`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //遍历所有数据，设置日期格式
        result = window.__.filter(res.body, item => {
            //日期格式化操作
            item['create_time'] = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            item['join_time'] = tools.formatDate(item['join_time'], 'yyyy-MM-dd');

            //遍历对象属性
            for (let key of Object.keys(item)) {
                //获取属性的值
                var value = item[key];
                //如果是数字类型，则保留两位小数
                if (typeof value == 'number') {
                    item[key] = value.toFixed(2);
                }
            }

            return true;
        });

        return result[0];
    } catch (err) {
        console.log(err);

        return 0;
    }
}

/**
 * @function 查询工资表单信息
 */
export async function queryRegisterByParam(
    username = '',
    params = '',
    page = 0,
    size = 50,
    result = ''
) {
    //条件SQL
    var whereSQL = '';

    try {
        //根据条件构造参数
        if (tools.deNull(params.name) != '') {
            whereSQL = whereSQL + `~and(name,eq,${params.name})`;
        }
    } catch (error) {
        console.error(error);
    }

    try {
        //检查查询条件中是否含有时间
        if (tools.deNull(params.time) != '') {
            var starttime = '';
            var endtime = '';

            //设置时间
            if (params.time.length == 0) {
                starttime = new Date();
                endtime = new Date();
            } else if (params.time.length == 1) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = new Date();
                } catch (error) {
                    starttime = params.time[0];
                    endtime = new Date();
                }
            } else if (params.time.length >= 2) {
                try {
                    starttime = params.time[0].format('YYYY-MM-DD');
                    endtime = params.time[1].format('YYYY-MM-DD');
                } catch (error) {
                    starttime = params.time[0];
                    endtime = params.time[1];
                }
            }

            starttime = tools.formatDate(starttime, 'yyyy-MM-dd') + ' 00:00:00';
            endtime = tools.formatDate(endtime, 'yyyy-MM-dd') + ' 23:59:59';

            whereSQL = whereSQL + `~and(join_time,bw,${starttime},${endtime})`;
        }
    } catch (error) {
        console.error(error);
    }

    //提交URL
    var queryURL = `${api.restapi}/api/bs_user_info?_where=(id,ne,'')${whereSQL}&_p=${page}&_size=${size}&_sort=-join_time`;

    try {
        //发送HTTP请求，获取博文数量
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        //遍历所有数据，设置日期格式
        result = window.__.filter(res.body, item => {
            //日期格式化操作
            item['create_time'] = tools.formatDate(item['create_time'], 'yyyy-MM-dd');
            item['join_time'] = tools.formatDate(item['join_time'], 'yyyy-MM-dd');

            //遍历对象属性
            for (let key of Object.keys(item)) {
                //获取属性的值
                var value = item[key];
                //如果是数字类型，则保留两位小数
                if (typeof value == 'number') {
                    item[key] = value.toFixed(2);
                }
            }

            return true;
        });

        return result;
    } catch (err) {
        console.log(err);

        return 0;
    }
}

/**
 * @function 查询附件中的文档地址
 */
export async function queryOfficeURL(text) {
    //文档数组
    var fileList = [];
    var officeList = [];

    try {
        //如果text为空，则返回空数组
        if (tools.deNull(text) == '') {
            return [];
        }
        //如果含有多个地址，则split后获取数组
        if (tools.deNull(text).indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }
    } catch (error) {
        console.log('query office url error :' + error);
    }

    try {
        //遍历并筛选出里面的图片信息
        fileList = window.__.filter(fileList, function(text) {
            //获取小写后的路径
            var ptext = tools.deNull(text).toLowerCase();
            //定义下载地址
            var download = window._CONFIG['downloadURL'] + '/';
            //文档预览URL
            var previewURL = window._CONFIG['viewURL'];

            //获取图片标识
            var flag =
                ptext.includes('jpg') ||
                ptext.includes('jpeg') ||
                ptext.includes('bmp') ||
                ptext.includes('gif') ||
                ptext.includes('webp') ||
                ptext.includes('svg') ||
                ptext.includes('png');

            //文档名称
            var name = ptext;

            //设置文档名称
            try {
                name = name.replace('files/', '');
            } catch (error) {
                console.log('设置文档名称异常：' + error);
            }

            //获取文档真实下载地址
            download = download + text;

            //URL加密，保证中文路径可以被正常解析
            var xurl = download.replace('files/', 'files/convert/');
            //去掉后缀
            xurl = xurl.substring(0, xurl.lastIndexOf('.'));

            //获取文件后缀
            var suffix = tools
                .deNull(download)
                .substring(download.lastIndexOf('.'), download.length)
                .toLowerCase();

            //如果word文档，则使用微软API打开
            text = tools.deNull(suffix).includes('xls') ? xurl + '.html' : download;

            //如果word文档，则使用微软API打开
            text = tools.deNull(suffix).includes('svg') ? download : download;

            //如果word文档，则使用微软API打开
            text =
                tools.deNull(suffix).includes('doc') ||
                tools.deNull(suffix).includes('ppt') ||
                tools.deNull(suffix).includes('pdf') ?
                xurl + '.pdf' :
                download;

            //file文件URL路径
            var fileURL = `${text}`;

            //设置加密路径
            xurl = encodeURIComponent(xurl);

            //如果word文档，则使用微软API打开
            text =
                tools.deNull(suffix).includes('doc') ||
                tools.deNull(suffix).includes('ppt') ||
                tools.deNull(suffix).includes('pdf') ?
                previewURL + xurl + '.pdf' :
                text;

            //如果文件路径为文档地址，则存入officeList中
            if (!flag) {
                //将数据存入officeList中
                officeList.push({
                    title: '文档',
                    src: text,
                    file: fileURL,
                    msrc: download,
                    name: name,
                });
            }

            //返回过滤结果
            return flag;
        });
    } catch (error) {
        console.log('query office url error :' + error);
    }

    //返回office数组信息
    return officeList;
}

/**
 * @function 设置详情页面图片展示样式
 */
export function changeImageCSS() {
    //执行间隔
    var imgInterval = [100, 500, 1000, 3000, 5000, 7000, 9000];
    //设置图片预览CSS样式
    try {
        setTimeouts(
            () => {
                postcss();
            },
            ...imgInterval
        );
    } catch (error) {
        console.log('change image css error :' + error);
    }
    //隐藏文档预览服务的图标
    try {
        //等待一段时间，文档加载完毕后，才可隐藏图标
        setTimeout(() => {
            $('.fa-file-image-o', $('#fileviewFrame')).remove();
        }, 3000);
    } catch (error) {
        console.log('hidden image icon of fileview framework');
    }
}

/**
 * @function callback连续执行函数
 */
export function setTimeouts(callback, ...times) {
    for (let time of times) {
        setTimeout(() => {
            callback();
            console.log('执行callback函数 ，times:' + time);
        }, time);
    }
}

/**
 * @function 设置css样式
 */
export function postcss() {
    try {
        //图片预览，Css设置Float:left
        $('figure[itemscope="itemscope"]').css('float', 'left');
        $('figure[itemscope="itemscope"]').css('margin-right', '10px');
        $('figure[itemscope="itemscope"]').css('margin-bottom', '10px');
        //图片预览，文件名称展示位置Center
        $('.pswp__caption__center').css('text-align', 'center');
        //异常图片高度，避免竖版图片走样
        $('.pswp__img').css('height', '');
    } catch (error) {
        console.error(error);
    }
}

/**
 * @function 获取当前节点是否有知会或者审批节点信息
 */
export async function queryCurNodePageType(pageType) {
    //获取页面类型
    var type = tools.queryUrlString('type');

    try {
        //如果审批详情或者知会详情页面，则设置pageType
        if (type == 'workflow' || type == 'notify') {
            //获取当前节点审批流程数据）
            var flag = await queryProcessLogByID(
                tools.queryUrlString('table_name'),
                tools.queryUrlString('processLogID')
            );

            //获取当前节点知会流程数据
            if (tools.deNull(flag) == '') {
                flag = await queryProcessLogInfByID(
                    tools.queryUrlString('table_name'),
                    tools.queryUrlString('processLogID')
                );
            }

            //获取页面类型
            pageType = tools.deNull(flag) == '' ? 'view' : pageType;
        } else if (type == 'workflowing') {
            //
            console.log('TODO 暂时不做');
        }
    } catch (error) {
        console.log('获取当前节点是否有知会或者审批节点信息异常:' + error);
    }

    //返回pageType
    return pageType;
}

/**
 * @function 渲染审批流程详情
 */
export async function colorProcessDetail(that, main) {
    try {
        main.curRow = that.curRow;
    } catch (error) {
        console.log('set curRow error :' + error);
    }
    try {
        main.depart = that.depart;
    } catch (error) {
        console.log('set depart error :' + error);
    }
    try {
        main.workflows = that.workflows;
    } catch (error) {
        console.log('set curRow workflows error :' + error);
    }
    try {
        main.columns = that.curRow.sub_columns;
    } catch (error) {
        console.log('set curRow sub_columns error :' + error);
    }
    try {
        main.data = that.curRow.sub_data;
    } catch (error) {
        console.log('set curRow sub_data error :' + error);
    }
    try {
        main.pageType = tools.queryUrlString('type');
    } catch (error) {
        console.log('set curRow pageType error :' + error);
    }
    try {
        main.curRow.fileStatus = tools.deNull(main.curRow.files) == '' ? 1 : 0;
    } catch (error) {
        console.log('set curRow fileStatus error :' + error);
    }
    try {
        main.curRow.fileType = queryFileType(main.curRow.files);
    } catch (error) {
        console.log('set curRow fileType error :' + error);
    }
    try {
        main.curRow.fileURL = await queryFileViewURL(main.curRow.files);
    } catch (error) {
        console.log('set curRow fileURL error :' + error);
    }
    try {
        main.curRow.officeList = await queryOfficeURL(main.curRow.files);
    } catch (error) {
        console.log('set curRow OfficeURL error :' + error);
    }
    try {
        main.slides = queryImageURL(main.curRow.files);
    } catch (error) {
        console.log('set curRow slides error :' + error);
    }
    try {
        main.tableName = tools.queryUrlString('table_name');
    } catch (error) {
        console.log('set curRow tableName error :' + error);
    }
    //检查是否可以进行审批/同意等操作
    try {
        main.pageType = await queryCurNodePageType(main.pageType);
    } catch (error) {
        console.log('set curRow pageType error :' + error);
    }
    //查询表字段信息
    try {
        main.tableInfo = await queryTableFieldInfoJSON(main.tableName);
    } catch (error) {
        console.log('set tableInfo error :' + error);
    }
    //修改图片样式
    try {
        changeImageCSS();
    } catch (error) {
        console.log('change image css error :' + error);
    }

    //返回设置结果
    return main;
}

/**
 * @function 查询表字段信息
 * @param {*} tableName
 */
export async function queryTableFieldInfoJSON(tableName) {
    try {
        //查询表单信息
        var tableInfo = await queryTableDataByField(
            'v_table_info',
            'id',
            tableName
        );
        //如果信息不为空，则解析表单信息
        if (tools.deNull(tableInfo) != '' && tableInfo.length > 0) {
            try {
                tableInfo = tools.deNull(tableInfo[0]['value']);
            } catch (error) {
                console.log('tabale info :' + tableInfo);
            }
        }
        //如果信息不为空，则进行解析数据
        if (tools.deNull(tableInfo) != '') {
            try {
                tableInfo = JSON.parse(tableInfo);
            } catch (error) {
                console.log('tabale info :' + tableInfo);
            }
        }
    } catch (error) {
        console.log('query table field info json error :' + error);
    }
    return tableInfo;
}

/**
 * @function 查询工作流节点状态
 */
export async function queryWorkflowStatus(tableName, id) {
    //定义返回节点信息
    var node = null;

    //节点状态信息（待提交）
    var node_0 = JSON.parse(
        '{"start":{"status":"wait","name":"发起","color":""},"audit":{"status":"wait","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}'
    );
    //节点状态信息（处理中）
    var node_1 = JSON.parse(
        '{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"wait","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}'
    );
    //节点状态信息（审核完成）
    var node_2 = JSON.parse(
        '{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}'
    );
    //节点状态信息（审批完成）
    var node_3 = JSON.parse(
        '{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"finish","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}'
    );
    //节点状态信息（知会完成）
    var node_4 = JSON.parse(
        '{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"finish","name":"审批","color":""},"message":{"status":"finish","name":"知会","color":"pink"}}'
    );

    //获取当前表单信息
    var curRow = await queryTableData(tableName, id);

    //根据流程状态，设置流程图渲染状态
    if (tools.deNull(curRow) != '' && curRow.bpm_status == 1) {
        node = node_0;
    } else if (tools.deNull(curRow) != '' && curRow.bpm_status == 2) {
        node = node_1;
    } else if (tools.deNull(curRow) != '' && curRow.bpm_status == 3) {
        node = node_2;
    } else if (tools.deNull(curRow) != '' && curRow.bpm_status == 4) {
        node = node_3;
    } else if (tools.deNull(curRow) != '' && curRow.bpm_status == 5) {
        node = node_4;
    } else {
        node = node_0;
    }

    //打印查询参数
    console.log(`tableName: ${tableName} \n\r id: ${id}`);

    //返回节点信息
    return node;
}

/**
 * @function 检测URL是否有效
 * @param {*} url
 */
export async function queryUrlValid(url) {
    //提交URL
    var queryURL = `${window._CONFIG['validURL']}${url}`;

    try {
        const res = await superagent.get(queryURL);
        console.log(' url :' + url + ' result :' + JSON.stringify(res));
        return res.body.success;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询用户总数
 */
export async function queryUserCount() {
    //提交URL
    var queryURL = `${api.restapi}/api/v_user/count`;

    try {
        const res = await superagent.get(queryURL);
        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));
        return res.body[0]['no_of_rows'];
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询流程总数
 */
export async function queryWflowCount() {
    //提交URL
    var queryURL = `${api.restapi}/api/v_workflow_total/count`;

    try {
        const res = await superagent.get(queryURL);
        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));
        return res.body[0]['no_of_rows'];
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询月度流程数
 */
export async function queryWflowMonthCount() {
    //提交URL
    var queryURL = `${api.restapi}/api/v_workflow_monthly`;

    try {
        //打印
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //流程日同比率
        const ratio = res.body[0]['total'];

        //返回流程日同比率
        return ratio;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询流程总数
 */
export async function queryWflowDayCount() {
    //获取日期格式
    var ctime = tools.formatDate(new Date(), 'yyyy-MM-dd');

    //提交URL
    var queryURL = `${api.restapi}/api/v_workflow_total?_where=(ctime,eq,${ctime})`;

    try {
        const res = await superagent.get(queryURL);
        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));
        return res.body.length;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询流程总数
 */
export async function queryWflowDailyRatio() {
    //提交URL
    var queryURL = `${api.restapi}/api/v_workflow_daily`;

    try {
        //打印
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //流程日同比率
        const ratio =
            parseInt(
                ((res.body[0]['total'] - res.body[1]['total']) / res.body[1]['total']) *
                10000
            ) / 100;

        //返回流程日同比率
        return ratio;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询流程总数
 */
export async function queryWflowMonthlyRatio() {
    //提交URL
    var queryURL = `${api.restapi}/api/v_workflow_monthly`;

    try {
        //打印
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //流程日同比率
        const ratio =
            parseInt(
                ((res.body[0]['total'] - res.body[1]['total']) / res.body[1]['total']) *
                10000
            ) / 100;

        //返回流程日同比率
        return ratio;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 查询月度新增用户数
 */
export async function queryNewUserTotal() {

    try {
        //获取日期格式
        var cmonth = moment().format('YYYY-MM')

        //提交URL
        var queryURL = `${api.restapi}/api/v_user_monthly?_where=(month,eq,${cmonth})`;

        //发送请求
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //月度新增用户数
        const ratio = res.body[0]['total'];

        //返回月度新增用户数
        return ratio;
    } catch (err) {
        console.log(err);
        //返回月度新增用户数
        return 0;
    }
}

/**
 * @function 查询上月月度新增用户数
 */
export async function queryNewUserTotalLastMonth() {

    try {
        //获取日期格式
        var cmonth = moment().month(moment().month() - 1).format('YYYY-MM');

        //提交URL
        var queryURL = `${api.restapi}/api/v_user_monthly?_where=(month,eq,${cmonth})`;

        //发送请求
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //月度新增用户数
        const ratio = res.body[0]['total'];

        //返回月度新增用户数
        return ratio;
    } catch (err) {
        console.log(err);
        //返回月度新增用户数
        return 0;
    }
}

/**
 * @function 查询业务数据
 */
export async function queryBusinessTotal() {
    //提交URL
    var queryURL = `${api.restapi}/api/onl_cgform_head/count`;

    try {
        //发送请求
        const res = await superagent.get(queryURL);

        console.log(' url :' + queryURL + ' result :' + JSON.stringify(res));

        //业务数据
        const ratio = res.body[0]['no_of_rows'];

        //返回业务数据
        return ratio;
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function 获取问卷信息列表
 */
export async function queryQuestionList(username, page = 0, size = 99) {

    //提交URL
    var queryURL = `${api.restapi}/api/bs_questions?_where=(create_by,eq,${username})&_p=${page}&_size=${size}`;

    try {
        //发送请求
        const res = await superagent.get(queryURL);

        //业务数据
        const list = res.body;

        //返回业务数据
        return list;
    } catch (err) {
        console.log(err);
    }

}

/**
 * @function 获取问卷信息列表
 */
export async function queryQuestionById(id, page = 0, size = 99) {

    //提交URL
    var queryURL = `${api.restapi}/api/bs_questions?_where=(id,eq,${id})&_p=${page}&_size=${size}`;

    try {
        //发送请求
        const res = await superagent.get(queryURL);

        //业务数据
        const list = res.body[0];

        //返回业务数据
        return list;
    } catch (err) {
        console.log(err);
        //未获取到数据，返回空
        return null;
    }

}

/**
 * @function 将当前自由流程的数据转移到历史数据中
 * @param {*} id
 */
export async function transFreeWflowHis(id) {
    //将当前自由流程的数据转移到历史数据中
    let result = await workflowAPI.transFreeWflowHis(id);

    //打印返回结果
    console.log('result :' + result);

    return result;
}

/**
 * @function 将英文名转化为中文名
 */
export async function patchEnameCname(origin) {
    //中文名称
    var chinese = '';

    //原始英文名称列表
    var originlist = tools.deNull(origin).split(',');

    //查询用户信息
    var userlist = await queryUserName();

    //遍历用户获取中文名称列表
    for (var ename of originlist) {
        //获取流程发起人的中文信息
        var user = window.__.find(userlist, item => {
            return ename == item.username;
        });

        //如果找到用户信息，则设置用户信息
        if (!tools.isNull(user)) {
            chinese = `${chinese},${user.realname}`;
        }
    }

    //去掉字符串开头的逗号
    if (chinese.startsWith(',')) {
        chinese = chinese.substring(1);
    }

    //去掉字符串结尾的逗号
    if (chinese.endsWith(',')) {
        chinese = chinese.substring(0, chinese.length - 1);
    }

    //返回中文名称列表
    return chinese;
}

/**
 * @function 将英文名转化为中文名
 */
export async function patchCnameEname(origin) {
    //中文名称
    var chinese = '';

    //原始英文名称列表
    var originlist = tools.deNull(origin).split(',');

    //查询用户信息
    var userlist = await queryUserName();

    //遍历用户获取中文名称列表
    for (var ename of originlist) {

        //获取流程发起人的中文信息
        var user = window.__.find(userlist, item => {
            return ename == item.realname;
        });

        //如果找到用户信息，则设置用户信息
        if (!tools.isNull(user)) {
            chinese = `${chinese},${user.username}`;
        }

    }

    //去掉字符串开头的逗号
    if (chinese.startsWith(',')) {
        chinese = chinese.substring(1);
    }

    //去掉字符串结尾的逗号
    if (chinese.endsWith(',')) {
        chinese = chinese.substring(0, chinese.length - 1);
    }

    //返回中文名称列表
    return chinese;
}