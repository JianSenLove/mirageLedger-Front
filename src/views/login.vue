<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">教务管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button :icon="User" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password"
                        @keyup.enter="submitForm(login)">
                        <template #prepend>
                            <el-button :icon="Lock" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm(login)">登录</el-button>
                </div>
                <el-checkbox class="login-tips" v-model="checked" label="记住密码" size="large" />
                <p class="login-tips">(教师端)</p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { userLogin, register } from '../api/index';

interface LoginInfo {
    username: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    username: defParam ? defParam.username : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
    const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
        if (valid) {
            try {
                // 直接调用登录接口，响应数据已经是response.data
                const response = await userLogin(param.username, param.password);
                console.log(response);
                // 判断响应中是否包含token，此时response直接是数据部分
                if (response.token) {
                    ElMessage.success('登录成功');
                    // 保存用户凭证
                    localStorage.setItem('jwt_token', response.token); // 直接使用response.token
                    localStorage.setItem('ms_username', param.username);
                    const keys = permiss.defaultList[param.username === 'admin' ? 'admin' : 'user'];
                    permiss.handleSet(keys);
                    localStorage.setItem('ms_keys', JSON.stringify(keys));
                    router.push('/');
                    if (checked.value) {
                        localStorage.setItem('login-param', JSON.stringify(param));
                    } else {
                        localStorage.removeItem('login-param');
                    }
                } else {
                    // 如果响应中没有token，视为登录失败
                    ElMessage.error('登录失败: 账号或密码错误');
                    return false;
                }
            } catch (error) {
                // 捕获到错误，可能是请求失败或者其他原因
                ElMessage.error('登录失败: ' + error);
                return false;
            }
        } else {
            // 账号信息验证未通过
            ElMessage.error('请填入账号密码');
            return false;
        }
    });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login_bg.jpg);
    background-size: 100%;
}

.ms-title {
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    font-weight: bold;
    padding-top: 10px;
}

.ms-login {
    width: 350px;
    border-radius: 5px;
    background: #fff;
}

.ms-content {
    padding: 10px 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
}
</style>
