<template>
    <div class="form-making-height">
        <fm-making-form ref="makingFrom" preview generate-json>
            <template slot="action">
                <el-button type="text" icon="el-icon-upload"
                           @click="btnSave">保存
                </el-button>
            </template>
        </fm-making-form>
    </div>
</template>
<script>
    import {updateForm, getFormById} from '@/api/flowable-form'

    export default {
        name: 'FlowableFormEdit',
        data() {
            return {
                formKey: undefined,
                formData: {
                    formKey: undefined,
                    formName: '',
                    formJson: ''
                },
                defaultJson: {"list": [], "config": {"labelWidth": 100, "labelPosition": "right", "size": "small"}}
            }
        },
        created() {
            if (this.$route.query && this.$route.query.formKey) {
                this.formKey = this.$route.query.formKey
            }
            this.getFormData()
        },
        methods: {
            getFormData() {
                if (!this.formKey) {
                    this.$message({
                        type: 'error',
                        message: 'formKey is null'
                    })
                    return
                }
                getFormById({id: this.formKey}).then(({data}) => {
                    this.formData = data.data
                    if (this.formData && this.formData.formJson) {
                        setTimeout(() => this.$refs.makingFrom.setJSON(JSON.parse(this.formData.formJson)), 100)
                    } else {
                        setTimeout(() => this.$refs.makingFrom.setJSON(this.defaultJson), 100)
                    }
                })
            },
            btnSave() {
                this.formData.formJson = JSON.stringify(this.$refs.makingFrom.getJSON())
                updateForm(this.formData).then(({msg}) => {
                    this.$message({
                        type: 'success',
                        message: msg
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .form-making-height {
        height: calc(100vh - 84px);
    }
</style>