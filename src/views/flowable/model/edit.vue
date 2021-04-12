<template>
    <div v-if="show">
        <vue-bpmn @save="btnSave" :modelData="modelData"/>
    </div>
</template>
<script>
    import {queryById, saveModelEditor} from '@/api/flowable-model'
    import VueBpmn from "@/components/VueBpmn";

    export default {
        name: 'FlowableModelEdit',
        components: {VueBpmn},
        data() {
            return {
                id: undefined,
                modelData: {
                    id: undefined,
                    editor: undefined
                },
                show: false
            }
        },
        mounted() {
            if (this.$route.query && this.$route.query.id) {
                this.id = this.$route.query.id
            }
            this.getModelData()
        },
        methods: {
            getModelData() {
                if (!this.id) {
                    this.$message({
                        type: 'error',
                        message: 'id is null'
                    })
                    return
                }
                queryById({id: this.id}).then(({data}) => {
                    let mydata = data.data
                    this.modelData.id = mydata.id
                    this.modelData.editor = mydata.editor
                    this.modelData.key = mydata.key
                    this.modelData.name = mydata.name
                    this.modelData.category = mydata.category
                    this.modelData.description = mydata.description
                    this.show = true
                })
            },
            btnSave(modelData) {
                saveModelEditor(modelData).then(({msg}) => {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                })
            }
        }
    }
</script>