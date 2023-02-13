<template>
  <div>
    <div v-if="nodeConfig.type != 'route'" class="node-wrap">
      <div
        :class="{
          'node-wrap-box': true,
          'start-node': nodeConfig.type == 'start',
          'active error': Boolean(isTried && nodeConfig.error),
        }"
      >
        <div>
          <div class="title" :style="'background:#f90;'">
            <span v-show="nodeConfig.type == 'approver'" class="iconfont">
            </span>
            <span v-show="nodeConfig.type == 'notifier'" class="iconfont">
            </span>
            <span v-if="nodeConfig.type == 'start'">{{ nodeConfig.name }}</span>
            <input
              v-if="nodeConfig.type != 'start' && isInput"
              v-model="nodeConfig.name"
              v-focus
              class="ant-input editable-title-input"
              type="text"
              :disabled="isSaw"
              :placeholder="placeholderObject[nodeConfig.type]"
              @blur="blurEvent()"
              @focus="$event.currentTarget.select()"
            />
            <span
              v-if="nodeConfig.type != 'start' && !isInput"
              class="editable-title"
              @click="clickEvent()"
            >
              {{ nodeConfig.name }}
            </span>
            <i
              v-if="nodeConfig.type != 'start'"
              class="anticon anticon-close close"
              @click="delNode()"
            ></i>
          </div>
          <div class="content" @click="setPerson">
            <div v-if="nodeConfig.type == 'start'" class="text">
              <span v-if="!setApproverStr(nodeConfig)" class="placeholder">
                {{
                  arrToStr(flowPermission) ? arrToStr(flowPermission) : "所有人"
                }}
              </span>
              {{ setApproverStr(nodeConfig) }}
            </div>
            <div v-if="nodeConfig.type == 'approver'" class="text">
              <span
                v-if="
                  !setApproverStr(nodeConfig) &&
                  nodeConfig.properties.approvalNodeType != 'free'
                "
                class="placeholder"
              >
                请选择{{ placeholderObject[nodeConfig.type] }}
              </span>
              <span
                v-else-if="
                  !setApproverStr(nodeConfig) &&
                  nodeConfig.properties.approvalNodeType == 'free'
                "
                class="placeholder"
              >
                已选择灵活设置审批人
              </span>
              <el-tooltip
                v-if="setApproverStr(nodeConfig)"
                :content="` ${setApproverStr(nodeConfig)}`"
                placement="top"
              >
                <div class="approverText">
                  审核人员: {{ setApproverStr(nodeConfig) }}
                </div>
              </el-tooltip>
              <el-tooltip
                v-if="setCheckerStr(nodeConfig)"
                :content="` ${setCheckerStr(nodeConfig)}`"
                placement="bottom"
              >
                <div class="approverText">
                  查看人员: {{ setCheckerStr(nodeConfig) }}
                </div>
              </el-tooltip>
            </div>
            <div v-if="nodeConfig.type == 'notifier'" class="text">
              <span v-if="!copyerStr(nodeConfig)" class="placeholder">
                请选择{{ placeholderObject[nodeConfig.type] }}
              </span>
              {{ copyerStr(nodeConfig) }}
            </div>
            <i class="anticon anticon-right arrow"></i>
          </div>
          <div v-if="isTried && nodeConfig.error" class="error_tip">
            <i
              class="anticon anticon-exclamation-circle"
              style="color: rgb(242, 86, 67)"
            ></i>
          </div>
        </div>
      </div>
      <addNode
        :child-node-p.sync="nodeConfig.childNode"
        :prev-object="nodeConfig"
      ></addNode>
    </div>
    <div v-if="nodeConfig.type == 'route'" class="branch-wrap">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button v-if="!isSaw" class="add-branch" @click="addTerm">
            添加条件
          </button>
          <div
            v-for="(item, index) in nodeConfig.conditionNodes"
            :key="index"
            class="col-box"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  class="auto-judge"
                  :class="isTried && item.error ? 'error active' : ''"
                >
                  <div
                    v-if="index != 0"
                    class="sort-left"
                    @click="arrTransfer(index, -1)"
                  >
                    &lt;
                  </div>
                  <div class="title-wrapper">
                    <input
                      v-if="isInputList[index]"
                      v-model="item.name"
                      v-focus
                      type="text"
                      class="ant-input editable-title-input"
                      @blur="blurEvent(index)"
                      @focus="$event.currentTarget.select()"
                    />
                    <span
                      v-if="!isInputList[index]"
                      class="editable-title"
                      @click="clickEvent(index)"
                    >
                      {{ item.name }}
                    </span>
                    <span
                      class="priority-title"
                      @click="setPerson(item.priorityLevel)"
                    >
                      优先级{{ item.priorityLevel }}
                    </span>
                    <i
                      class="anticon anticon-close close"
                      @click="delTerm(index)"
                    ></i>
                  </div>
                  <div
                    v-if="index != nodeConfig.conditionNodes.length - 1"
                    class="sort-right"
                    @click="arrTransfer(index)"
                  >
                    &gt;
                  </div>
                  <div class="content" @click="setPerson(item.priorityLevel)">
                    {{ conditionStr(item, index) }}
                  </div>
                  <div v-if="isTried && item.error" class="error_tip">
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67)"
                    ></i>
                  </div>
                </div>
                <addNode
                  :child-node-p.sync="item.childNode"
                  :prev-object="item"
                ></addNode>
              </div>
            </div>
            <nodeWrap
              v-if="item.childNode && item.childNode"
              :node-config.sync="item.childNode"
              :table-id="tableId"
              :is-tried.sync="isTried"
              :director-max-level="directorMaxLevel"
              :node-num="NodeNum"
              :all-node="allNode"
            ></nodeWrap>
            <div v-if="index == 0" class="top-left-cover-line"></div>
            <div v-if="index == 0" class="bottom-left-cover-line"></div>
            <div
              v-if="index == nodeConfig.conditionNodes.length - 1"
              class="top-right-cover-line"
            ></div>
            <div
              v-if="index == nodeConfig.conditionNodes.length - 1"
              class="bottom-right-cover-line"
            ></div>
          </div>
        </div>
        <addNode
          :child-node-p.sync="nodeConfig.childNode"
          :prev-object="nodeConfig"
        ></addNode>
      </div>
    </div>
    <el-drawer
      class="set_promoter"
      :title="placeholderObject[nodeConfig.type] + '设置'"
      direction="rtl"
      size="550px"
      :append-to-body="true"
      :visible.sync="approverDrawer"
      :before-close="saveApprover"
    >
      <div v-if="approverConfig.properties" class="demo-drawer__content">
        <div class="drawer_content">
          <div class="approver_content">
            <el-radio-group
              v-model="approverConfig.properties.actionerType"
              class="clear"
              style="width: 100%"
              @change="changeType"
            >
              <el-radio label="targetUserId">指定成员</el-radio>
              <el-radio label="targetDept">指定部门</el-radio>
              <el-radio label="targetPost">指定岗位</el-radio>
              <el-radio
                v-if="nodeConfig.type == 'start'"
                label="targetAllPerson"
              >
                所有人
              </el-radio>
              <el-radio
                v-if="nodeConfig.type != 'start'"
                label="targetInitiatorPerson"
              >
                发起人
              </el-radio>
              <el-radio label="targetWorkFlowRole">流程角色</el-radio>
            </el-radio-group>
            <select-people
              v-if="approverConfig.properties.actionerType == 'targetUserId'"
              v-model="approverConfig.properties.nodeUserList"
              title="添加/修改审批人"
              multiple
              :show-value="true"
            />
            <select-dept
              v-if="approverConfig.properties.actionerType == 'targetDept'"
              v-model="approverConfig.properties.nodeDeptList"
              title="添加/修改部门"
              multiple
              :show-value="true"
            />

            <select-people
              v-if="approverConfig.properties.actionerType == 'targetRole'"
              v-model="approverConfig.properties.nodeRoleList"
              type="role"
              multiple
              title="添加/修改角色"
              :show-value="true"
            />
            <!-- 指定岗位 -->
            <select-post
              v-if="approverConfig.properties.actionerType == 'targetPost'"
              :node-data.sync="approverConfig.properties.nodePostList"
            />
            <!-- 流程角色 -->
            <el-select
              v-if="
                approverConfig.properties.actionerType == 'targetWorkFlowRole'
              "
              v-model="processRole"
              placeholder="请选择"
            >
              <el-option
                v-for="item in processRoleList"
                :key="item.workflowRoleId"
                :label="item.roleName"
                :value="item.workflowRoleId"
              >
              </el-option>
            </el-select>
          </div>
          <div v-if="NodeNum > 1" class="switch-container">
            <div class="reject-switch">
              是否驳回：<el-switch
                v-model="approverConfig.properties.rejectFlag"
                :active-value="1"
                :inactive-value="0"
                @change="rejectChange"
              >
              </el-switch>
            </div>
            <div
              v-if="approverConfig.properties.rejectFlag == 1"
              class="reject-switch"
            >
              驳回节点：<el-select
                v-model="approverConfig.properties.rejectType"
                placeholder="请选择"
                @change="rejectNode"
              >
                <el-option
                  v-for="item in rejectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div v-if="approverConfig.properties.rejectType == 1">
              自定义节点：<el-select
                v-model="approverConfig.properties.rejectNodeId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in allNodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div v-if="nodeConfig.type != 'start'" class="switch-container">
            是否显示不通过：<el-switch
              v-model="approverConfig.properties.failFlag"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </div>
          <div
            v-if="
              approverConfig.properties &&
              approverConfig.properties.actionerType == 2
            "
            class="approver_manager"
          >
            <p>
              <span>发起人的：</span>
              <select v-model="approverConfig.directorLevel">
                <option
                  v-for="item in directorMaxLevel"
                  :key="item"
                  :value="item"
                >
                  {{ item == 1 ? "直接" : "第" + item + "级" }}主管
                </option>
              </select>
            </p>
            <p class="tip">找不到主管时，由上级主管代审批</p>
          </div>
          <div
            v-if="
              approverConfig.properties &&
              approverConfig.properties.actionerType == 5
            "
            class="approver_self"
          >
            <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
          </div>
          <div
            v-show="
              approverConfig.properties &&
              approverConfig.properties.actionerType == 4
            "
            class="approver_self_select"
          >
            <el-radio-group
              v-model="approverConfig.selectMode"
              style="width: 100%"
            >
              <el-radio :label="1">选一个人</el-radio>
              <el-radio :label="2">选多个人</el-radio>
            </el-radio-group>
            <h3>选择范围</h3>
            <el-radio-group
              v-model="approverConfig.selectRange"
              style="width: 100%"
              @change="changeRange"
            >
              <el-radio :label="1">全公司</el-radio>
              <el-radio :label="2">指定成员</el-radio>
              <el-radio :label="3">指定角色</el-radio>
            </el-radio-group>
            <select-people
              v-if="approverConfig.selectRange == 2"
              v-model="approverConfig.properties.nodeUserList"
              title="添加/修改成员"
              :multiple="true"
              :show-value="true"
            >
            </select-people>
            <select-people
              v-if="approverConfig.selectRange == 3"
              v-model="approverConfig.properties.nodeUserList"
              title="添加/修改角色"
              :multiple="true"
              :show-value="true"
              type="role"
            >
            </select-people>
          </div>
          <div
            v-if="approverConfig.properties.actionerType == 7"
            class="approver_manager"
          >
            <p>审批终点</p>
            <p style="padding-bottom: 20px">
              <span>发起人的：</span>
              <select v-model="approverConfig.examineEndDirectorLevel">
                <option
                  v-for="item in directorMaxLevel"
                  :key="item"
                  :value="item"
                >
                  {{ item == 1 ? "最高" : "第" + item }}层级主管
                </option>
              </select>
            </p>
          </div>
          <div v-if="showMultipleApproval" class="approver_some">
            <p>多人审批时采用的审批方式</p>
            <el-radio-group
              v-model="approverConfig.properties.activateType"
              class="clear"
            >
              <el-radio
                v-if="approverConfig.properties.actionerType == 'targetUserId'"
                label="ONE_BY_ONE"
              >
                依次审批
              </el-radio>
              <br />
              <el-radio
                v-if="approverConfig.properties.actionerType != 2"
                label="AND"
              >
                会签（所有人同意）
              </el-radio>
              <br />
              <el-radio
                v-if="approverConfig.properties.actionerType != 2"
                label="OR"
              >
                或签（一名审批人同意或拒绝即可）
              </el-radio>
            </el-radio-group>
          </div>
          <div v-if="nodeConfig.type != 'start'" class="approver_some">
            <p>灵活设置审批人</p>
            <el-switch
              v-model="approverConfig.properties.approvalNodeType"
              :active-value="'free'"
              :inactive-value="'false'"
            >
            </el-switch>
          </div>
          <div
            v-if="
              (approverConfig.properties.actionerType == 'targetUserId' ||
                approverConfig.properties.actionerType == 'targetDept' ||
                approverConfig.properties.actionerType == 'targetRole') &&
              !approverConfig.properties.approvalNodeType == 'free'
            "
            class="approver_some"
          >
            <p>审批人为空时</p>
            <el-radio-group
              v-model="approverConfig.properties.noneActionerAction"
              class="clear"
            >
              <el-radio label="auto" :disabled="true">自动通过</el-radio>
              <br />
              <el-radio label="admin">自动转交管理员</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="saveApprover">确 定</el-button>
          <el-button @click="approverDrawer = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :append-to-body="true"
      title="抄送人设置"
      :visible.sync="copyerDrawer"
      direction="rtl"
      class="set_copyer"
      size="550px"
      :before-close="saveCopyer"
    >
      <div v-if="copyerConfig.properties" class="demo-drawer__content">
        <div class="copyer_content drawer_content">
          <select-people
            v-model="copyerConfig.properties.nodeUserList"
            title="添加成员"
            :multiple="true"
            :show-value="true"
          >
          </select-people>
          <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
            <el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="saveCopyer">确 定</el-button>
          <el-button @click="copyerDrawer = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :append-to-body="true"
      title="条件设置"
      :visible.sync="conditionDrawer"
      direction="rtl"
      class="condition_copyer"
      size="550px"
      :before-close="saveCondition"
    >
      <select v-model="conditionConfig.priorityLevel" class="priority_level">
        <option
          v-for="item in conditionsConfig.conditionNodes.length"
          :key="item"
          :value="item"
        >
          优先级{{ item }}
        </option>
      </select>
      <div v-if="conditionConfig.properties" class="demo-drawer__content">
        <div class="condition_content drawer_content">
          <p class="tip">当审批单同时满足以下条件时进入此流程</p>
          <ul>
            <li
              v-for="(item, index) in conditionConfig.properties.conditions"
              :key="index"
            >
              <span class="ellipsis">
                {{ item.type == 1 ? "发起人" : item.fieldName }}：
              </span>
              <div
                v-if="item.type == 1 && conditionConfig.properties.nodeUserList"
              >
                <select-people
                  v-model="conditionConfig.properties.nodeUserList"
                  title="添加/修改人员"
                  :multiple="true"
                  :show-value="true"
                >
                </select-people>
              </div>
              <div v-else-if="item.fieldType == 'String'">
                <p>
                  <select
                    v-model="item.optType"
                    style="width: 100px"
                    @change="changeOptType(item)"
                  >
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                    <option value="是">是</option>
                    <option value="不是">不是</option>
                  </select>
                  <input
                    v-if="!item.dictType"
                    v-model="item.zdy1"
                    type="text"
                    :placeholder="'请输入' + item.fieldName"
                  />
                  <!-- params传空数组，如果不传的话是字符串，接口会报错 -->
                  <ty-dictionary
                    v-else
                    is-all-value
                    width="180px"
                    res-list="data"
                    :action="`api/sysudc/udc/typeCodeExpr/${item.dictType}`"
                    interface-type="POST"
                    action-params="[]"
                    :value="item.zdy1"
                    :format-data="(res) => conditionDictFormatData(res, item)"
                    @input="handleConditionDictChange($event, item)"
                  ></ty-dictionary>
                </p>
              </div>
              <div v-else>
                <p>
                  <select
                    v-model="item.optType"
                    :style="'width:' + (item.optType == 6 ? 370 : 100) + 'px'"
                    @change="changeOptType(item)"
                  >
                    <option value="1">小于</option>
                    <option value="2">大于</option>
                    <option value="3">小于等于</option>
                    <option value="4">等于</option>
                    <option value="5">大于等于</option>
                    <option value="6">介于两个数之间</option>
                  </select>
                  <input
                    v-if="item.optType != 6"
                    v-model="item.zdy1"
                    v-enter-number="2"
                    type="text"
                    :placeholder="'请输入' + item.fieldName"
                  />
                </p>
                <p v-if="item.optType == 6">
                  <input
                    v-model="item.zdy1"
                    v-enter-number="2"
                    type="text"
                    style="width: 75px"
                    class="mr_10"
                  />
                  <select v-model="item.opt1" style="width: 60px">
                    <option value="<">&lt;</option>
                    <option value="≤">≤</option>
                  </select>
                  <span
                    class="ellipsis"
                    style="
                      display: inline-block;
                      width: 60px;
                      vertical-align: text-bottom;
                    "
                  >
                    {{ item.fieldName }}
                  </span>
                  <select v-model="item.opt2" style="width: 60px" class="ml_10">
                    <option value="<">&lt;</option>
                    <option value="≤">≤</option>
                  </select>
                  <input
                    v-model="item.zdy2"
                    v-enter-number="2"
                    type="text"
                    style="width: 75px"
                  />
                </p>
              </div>
              <a
                v-if="item.type == 1"
                @click="
                  conditionConfig.properties.nodeUserList = [];
                  removeEle(
                    conditionConfig.properties.conditions,
                    item,
                    'parameterCode',
                  );
                "
              >
                删除
              </a>
              <a
                v-if="item.type == 2"
                @click="
                  removeEle(
                    conditionConfig.properties.conditions,
                    item,
                    'parameterCode',
                  )
                "
              >
                删除
              </a>
            </li>
          </ul>
          <el-button v-if="!isSaw" type="primary" @click="addCondition">
            添加条件
          </el-button>
          <el-dialog
            title="选择条件"
            :visible.sync="conditionVisible"
            width="480px"
            append-to-body
            class="condition_list"
          >
            <p>请选择用来区分审批流程的条件字段</p>
            <p class="check_box">
              <a
                v-for="(item, index) in conditions"
                :key="index"
                :class="
                  toggleClass(conditionList, item, 'parameterCode') && 'active'
                "
                @click="toChecked(conditionList, item, 'parameterCode')"
              >
                {{ item.fieldName }}
              </a>
            </p>
            <span slot="footer" class="dialog-footer">
              <el-button class="cancelButton" @click="conditionVisible = false">
                取消
              </el-button>
              <el-button
                class="confirmButton"
                type="primary"
                @click="sureCondition"
              >
                确定
              </el-button>
            </span>
          </el-dialog>
        </div>
        <el-dialog
          title="选择成员"
          :visible.sync="conditionRoleVisible"
          width="600px"
          append-to-body
          class="promoter_person"
        >
          <div class="person_body clear">
            <div class="person_tree l">
              <input
                v-model="conditionRoleSearchName"
                type="text"
                placeholder="搜索成员"
                @input="getDebounceData($event, activeName)"
              />
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组织架构" name="1"></el-tab-pane>
                <el-tab-pane label="角色列表" name="2"></el-tab-pane>
              </el-tabs>
              <p
                v-if="activeName == 1 && !conditionRoleSearchName"
                class="ellipsis tree_nav"
              >
                <span class="ellipsis" @click="getDepartmentList(0)">天下</span>
                <span
                  v-for="(item, index) in departments.titleDepartments"
                  :key="index + 'a'"
                  class="ellipsis"
                  @click="getDepartmentList(item.id)"
                >
                  {{ item.departmentName }}
                </span>
              </p>
              <ul v-if="activeName == 1" style="height: 360px">
                <li
                  v-for="(item, index) in departments.childDepartments"
                  :key="index + 'b'"
                  class="check_box"
                >
                  <a
                    :class="
                      toggleClass(conditionDepartmentList, item) && 'active'
                    "
                    @click="toChecked(conditionDepartmentList, item)"
                  >
                    <img src="@/assets/images/approval/icon_file.png" />{{
                      item.departmentName
                    }}
                  </a>
                  <i @click="getDepartmentList(item.id)">下级</i>
                </li>
                <li
                  v-for="(item, index) in departments.employees"
                  :key="index + 'c'"
                  class="check_box"
                >
                  <a
                    :class="
                      toggleClass(conditionEmployessList, item) && 'active'
                    "
                    :title="item.departmentNames"
                    @click="toChecked(conditionEmployessList, item)"
                  >
                    <img src="@/assets/images/approval/icon_people.png" />{{
                      item.employeeName
                    }}
                  </a>
                </li>
              </ul>
              <ul v-if="activeName == 2" style="height: 360px">
                <li
                  v-for="(item, index) in roles"
                  :key="index + 'c'"
                  class="check_box"
                >
                  <a
                    :class="
                      toggleClass(conditionRoleList, item, 'roleId') && 'active'
                    "
                    :title="item.description"
                    @click="toChecked(conditionRoleList, item, 'roleId')"
                  >
                    <img src="@/assets/images/approval/icon_role.png" />{{
                      item.roleName
                    }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="has_selected l">
              <p class="clear">
                已选（{{
                  conditionDepartmentList.length +
                  conditionEmployessList.length +
                  conditionRoleList.length
                }}）
                <a
                  @click="
                    conditionDepartmentList = [];
                    conditionEmployessList = [];
                    conditionRoleList = [];
                  "
                >
                  清空
                </a>
              </p>
              <ul>
                <li
                  v-for="(item, index) in conditionRoleList"
                  :key="index + 'e'"
                >
                  <img src="@/assets/images/approval/icon_role.png" />
                  <span>{{ item.name }}</span>
                  <img
                    src="@/assets/images/approval/cancel.png"
                    @click="removeEle(conditionRoleList, item, 'roleId')"
                  />
                </li>
                <li
                  v-for="(item, index) in conditionDepartmentList"
                  :key="index + 'e1'"
                >
                  <img src="@/assets/images/approval/icon_file.png" />
                  <span>{{ item.departmentName }}</span>
                  <img
                    src="@/assets/images/approval/cancel.png"
                    @click="removeEle(conditionDepartmentList, item)"
                  />
                </li>
                <li
                  v-for="(item, index) in conditionEmployessList"
                  :key="index + 'e2'"
                >
                  <img src="@/assets/images/approval/icon_people.png" />
                  <span>{{ item.employeeName }}</span>
                  <img
                    src="@/assets/images/approval/cancel.png"
                    @click="removeEle(conditionEmployessList, item)"
                  />
                </li>
              </ul>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              class="cancelButton"
              @click="conditionRoleVisible = false"
            >
              取消
            </el-button>
            <el-button
              class="confirmButton"
              type="primary"
              @click="sureConditionRole"
            >
              确定
            </el-button>
          </span>
        </el-dialog>
        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="saveCondition">确 定</el-button>
          <el-button @click="conditionDrawer = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <nodeWrap
      v-if="nodeConfig.childNode && nodeConfig.childNode"
      :node-config.sync="nodeConfig.childNode"
      :table-id="tableId"
      :is-tried.sync="isTried"
      :director-max-level="directorMaxLevel"
      :is-saw="isSaw"
      :node-num="NodeNum + 1"
      :all-node="allNode"
    ></nodeWrap>
  </div>
</template>
<script>
import { getDomainInfo } from "@/api/approval/field-manage";
import SelectPeople from "@/components/SelectPeople";
import SelectDept from "@/components/SelectDept";
import selectPost from "@/components/selectPost";
import { getProcessRoleList } from "@/api/approval/role-setting.js";
import { getNodeId } from "@/utils/get-approval-node.js";
export default {
  components: {
    SelectPeople,
    SelectDept,
    selectPost,
  },
  props: [
    "nodeConfig",
    "flowPermission",
    "directorMaxLevel",
    "isTried",
    "tableId",
    "isSaw",
    "NodeNum", // 第几节点
    "allNode", // 所有节点
  ],
  data() {
    return {
      processRole: "", // 选择流程角色
      processRoleList: [], // 流程角色列表
      allNodeList: [], // 父级所有节点
      rejectList: [
        { label: "默认上一级", value: 0 },
        { label: "自定义", value: 1 },
      ], // 驳回选择列表
      placeholderObject: {
        start: "发起人",
        approver: "审批人",
        notifier: "抄送人",
      },
      isInputList: [],
      isInput: false,
      promoterDrawer: false,
      departments: {},
      checkedDepartmentList: [],
      checkedEmployessList: [],
      promoterSearchName: "",
      flowPermission1: this.flowPermission,
      approverDrawer: false,
      approverConfig: {},
      approverEmplyessList: [],
      approverSearchName: "",
      roles: [],
      roleList: [],
      approverRoleSearchName: "",
      copyerDrawer: false,
      copyerConfig: {},
      copyerSearchName: "",
      activeName: "1",
      copyerEmployessList: [],
      copyerRoleList: [],
      ccSelfSelectFlag: [],
      conditionDrawer: false,
      conditionVisible: false,
      conditionConfig: {},
      conditionsConfig: {
        conditionNodes: [],
      },
      bPriorityLevel: "",
      conditions: [],
      conditionList: [],
      conditionRoleVisible: false,
      conditionRoleSearchName: "",
      conditionDepartmentList: [],
      conditionEmployessList: [],
      conditionRoleList: [],
    };
  },
  computed: {
    // 审批方式
    showMultipleApproval() {
      const { selectMode, properties } = this.approverConfig;
      const {
        actionerType,
        nodeUserList,
        nodeDeptList,
        nodeRoleList,
        workFlowRoleList,
        nodePostList,
      } = properties;
      switch (actionerType) {
        case "targetUserId": // 指定用户
          return Boolean(nodeUserList && nodeUserList.length > 1);
        case "targetDept": // 指定部门
          return Boolean(nodeDeptList && nodeDeptList.length > 1);
        case "targetRole": // 指定角色
          return Boolean(nodeRoleList && nodeRoleList.length > 1);
        case "targetPost": // 指定岗位
          return Boolean(nodePostList && nodePostList.length > 1);
        case "targetWorkFlowRole": // 指定流程角色
          return Boolean(workFlowRoleList && workFlowRoleList.length > 1);
        case 2:
          return true;
        case 4:
          return selectMode == 2;
        default:
          return false;
      }
    },
  },
  watch: {
    processRole(row) {
      this.processRoleList.forEach((item) => {
        if (item.workflowRoleId == row) {
          this.approverConfig.properties.actionerType = "targetWorkFlowRole";
          this.approverConfig.properties.workFlowRoleList = [
            {
              workFlowRoleId: item.workflowRoleId,
              workFlowRoleName: item.roleName,
            },
          ];
        }
      });
    },
    approverDrawer(val) {
      if (val && this.NodeNum > 1) this.rejectNode(1);
    },
  },
  mounted() {
    getProcessRoleList(this.$route.query.domainId).then((res) => {
      this.processRoleList = res.data;
    });
    if (this.nodeConfig.type == "approver" || this.nodeConfig.type == "start") {
      this.nodeConfig.error = false; // !this.setApproverStr(this.nodeConfig)
    } else if (this.nodeConfig.type == "notifier") {
      this.nodeConfig.error = !this.copyerStr(this.nodeConfig);
    } else if (this.nodeConfig.type == "route") {
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
    }
  },
  methods: {
    clickEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, true);
      } else {
        this.isInput = true;
      }
    },
    blurEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, false);
        this.nodeConfig.conditionNodes[index].name = this.nodeConfig
          .conditionNodes[index].name
          ? this.nodeConfig.conditionNodes[index].name
          : "条件";
      } else {
        this.isInput = false;
        this.nodeConfig.name = this.nodeConfig.name
          ? this.nodeConfig.name
          : this.placeholderObject[this.nodeConfig.type];
      }
    },
    conditionStr(item, index) {
      var {
        properties: { conditions: conditionList, nodeUserList },
      } = item;
      if (conditionList && conditionList.length == 0) {
        return index == this.nodeConfig.conditionNodes.length - 1 &&
          this.nodeConfig.conditionNodes[0].properties.conditions.length != 0
          ? "其他条件进入此流程"
          : "请设置条件";
      } else {
        let str = "";
        for (var i = 0; i < conditionList.length; i++) {
          var {
            dictType,
            parameterCode,
            fieldType,
            fieldName,
            optType,
            zdy1,
            opt1,
            zdy2,
            opt2,
            dictLabel,
            fixedDownBoxValue,
          } = conditionList[i];
          if (parameterCode == 0) {
            if (nodeUserList.length != 0) {
              str += "发起人属于：";
              str +=
                nodeUserList
                  .map((item) => {
                    return item.name;
                  })
                  .join("或") + " 并且 ";
            }
          }
          if (fieldType == "String") {
            if (zdy1) {
              if (dictType) {
                //存在字典，取出字典中文
                str += `${fieldName} ${optType || "[未选择]"} ${
                  dictLabel || "[字典值]"
                } 并且 `;
              } else {
                str += `${fieldName} ${optType || "[未选择]"} ${zdy1} 并且 `;
              }
            }
          }
          if (fieldType == "Number") {
            if (optType != 6 && zdy1) {
              var optTypeStr = ["", "<", ">", "≤", "=", "≥"][optType];
              str += `${fieldName} ${optTypeStr} ${zdy1} 并且 `;
            } else if (optType == 6 && zdy1 && zdy2) {
              str += `${zdy1} ${opt1} ${fieldName} ${opt2} ${zdy2} 并且 `;
            }
          }
        }
        return str ? str.substring(0, str.length - 4) : "请设置条件";
      }
    },
    dealStr(str, obj) {
      let arr = [];
      let list = str.split(",");
      for (var elem in obj) {
        list.map((item) => {
          if (item == elem) {
            arr.push(obj[elem].value);
          }
        });
      }
      return arr.join("或");
    },
    //获取字典文本
    getDistLableFun(dictType, value) {
      console.log("获取字典文本接口");
      return new Promise((resolve) => {
        this.getDicts(dictType).then((response) => {
          const list = response.data;
          const vv = this.selectDictLabel(list, value);
          resolve(vv);
        });
      });
    },
    addConditionRole() {
      this.conditionRoleSearchName = "";
      this.conditionRoleVisible = true;
      this.activeName = "1";
      this.getDepartmentList();
      this.conditionDepartmentList = [];
      this.conditionEmployessList = [];
      this.conditionRoleList = [];
      for (
        var i = 0;
        i < this.conditionConfig.properties.nodeUserList.length;
        i++
      ) {
        var { type, name, targetId } =
          this.conditionConfig.properties.nodeUserList[i];
        if (type == 1) {
          this.conditionEmployessList.push({
            employeeName: name,
            id: targetId,
          });
        } else if (type == 2) {
          this.conditionRoleList.push({
            roleName: name,
            roleId: targetId,
          });
        } else if (type == 3) {
          this.conditionDepartmentList.push({
            departmentName: name,
            id: targetId,
          });
        }
      }
    },
    sureConditionRole() {
      this.conditionConfig.properties.nodeUserList = [];
      this.conditionRoleList.map((item) => {
        this.conditionConfig.properties.nodeUserList.push({
          type: 2,
          targetId: item.roleId,
          name: item.name,
        });
      });
      this.conditionDepartmentList.map((item) => {
        this.conditionConfig.properties.nodeUserList.push({
          type: 3,
          targetId: item.id,
          name: item.departmentName,
        });
      });
      this.conditionEmployessList.map((item) => {
        this.conditionConfig.properties.nodeUserList.push({
          type: 1,
          targetId: item.id,
          name: item.employeeName,
        });
      });
      this.conditionRoleVisible = false;
    },
    addCondition() {
      this.conditionList = [];
      this.conditionVisible = true;
      getDomainInfo(this.$route.query.domainId).then((res) => {
        this.conditions = res.data.bizForm;
        if (this.conditionConfig.properties.conditions) {
          for (
            var i = 0;
            i < this.conditionConfig.properties.conditions.length;
            i++
          ) {
            var { parameterCode } =
              this.conditionConfig.properties.conditions[i];
            if (parameterCode == 0) {
              this.conditionList.push({
                parameterCode: 0,
              });
            } else {
              this.conditionList.push(
                this.conditions.filter((item) => {
                  return item.parameterCode == parameterCode;
                })[0],
              );
            }
          }
        }
      });
    },
    changeOptType(item) {
      if (item.optType == 1) {
        item.zdy1 = 2;
        item.dictLabel = this.selectDictLabel(item.dict, item.zdy1);
      } else {
        item.zdy1 = 1;
        item.zdy2 = 2;
        item.dictLabel = this.selectDictLabel(item.dict, item.zdy1);
      }
    },
    sureCondition() {
      //1.弹窗有，外面无+
      //2.弹窗有，外面有不变
      for (var i = 0; i < this.conditionList.length; i++) {
        var {
          dictType,
          parameterCode,
          fieldName,
          columnName,
          fieldType,
          fixedDownBoxValue,
        } = this.conditionList[i];
        if (
          this.toggleClass(
            this.conditionConfig.properties.conditions,
            this.conditionList[i],
            "parameterCode",
          )
        ) {
          continue;
        }
        if (parameterCode == 0) {
          this.conditionConfig.properties.nodeUserList == [];
          this.conditionConfig.properties.conditions.push({
            type: 1,
            parameterCode: parameterCode,
            fieldName: "发起人",
          });
        } else {
          if (fieldType == "Number") {
            this.conditionConfig.properties.conditions.push({
              dictType,
              parameterCode: parameterCode,
              type: 2,
              fieldName: fieldName,
              optType: "1",
              zdy1: "2",
              opt1: "<",
              zdy2: "",
              opt2: "<",
              columnDbname: columnName,
              fieldType: fieldType,
            });
          } else if (fieldType == "String") {
            this.conditionConfig.properties.conditions.push({
              dictType,
              parameterCode: parameterCode,
              type: 2,
              fieldName: fieldName,
              zdy1: "",
              columnDbname: columnName,
              fieldType: fieldType,
              fixedDownBoxValue: fixedDownBoxValue,
            });
          }
        }
      }
      ////3.弹窗无，外面有-
      for (
        let i = this.conditionConfig.properties.conditions.length - 1;
        i >= 0;
        i--
      ) {
        if (
          !this.toggleClass(
            this.conditionList,
            this.conditionConfig.properties.conditions[i],
            "parameterCode",
          )
        ) {
          this.conditionConfig.properties.conditions.splice(i, 1);
        }
      }
      this.conditionConfig.properties.conditions.sort(function (a, b) {
        return a.parameterCode - b.parameterCode;
      });
      this.conditionVisible = false;
    },
    saveCondition() {
      this.conditionDrawer = false;
      var a = this.conditionsConfig.conditionNodes.splice(
        this.bPriorityLevel - 1,
        1,
      ); //截取旧下标
      this.conditionsConfig.conditionNodes.splice(
        this.conditionConfig.priorityLevel - 1,
        0,
        a[0],
      ); //填充新下标
      this.conditionsConfig.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1;
      });
      for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
        this.conditionsConfig.conditionNodes[i].error =
          this.conditionStr(this.conditionsConfig.conditionNodes[i], i) ==
            "请设置条件" &&
          i != this.conditionsConfig.conditionNodes.length - 1;
      }
      this.$emit("update:nodeConfig", this.conditionsConfig);
    },
    getDebounceData(event, type = 1) {
      this.$func.debounce(
        function () {
          if (event.target.value) {
            if (type == 1) {
              this.departments.childDepartments = [];
              this.$axios
                .get(
                  `${process.env.BASE_URL}employees.json?searchName=${event.target.value}&pageNum=1&pageSize=30`,
                )
                .then((res) => {
                  this.departments.employees = res.data.list;
                });
            } else {
              this.$axios
                .get(
                  `${process.env.BASE_URL}roles.json?searchName=${event.target.value}&pageNum=1&pageSize=30`,
                )
                .then((res) => {
                  this.roles = res.data.list;
                });
            }
          } else {
            type == 1 ? this.getDepartmentList() : this.getRoleList();
          }
        }.bind(this),
      )();
    },
    handleClick() {
      this.copyerSearchName = "";
      this.conditionRoleSearchName = "";
      if (this.activeName == 1) {
        this.getDepartmentList();
      } else {
        this.getRoleList();
      }
    },
    saveCopyer() {
      this.copyerConfig.ccSelfSelectFlag =
        this.ccSelfSelectFlag.length == 0 ? 0 : 1;
      this.copyerConfig.error = !this.copyerStr(this.copyerConfig);
      this.$emit("update:nodeConfig", this.copyerConfig);
      this.copyerDrawer = false;
    },
    copyerStr(nodeConfig) {
      if (nodeConfig.properties.nodeUserList.length != 0) {
        return this.arrToStr(nodeConfig.properties.nodeUserList);
      } else {
        if (nodeConfig.ccSelfSelectFlag == 1) {
          return "发起人自选";
        }
      }
    },
    changeRange() {
      this.approverConfig.properties.nodeUserList = [];
      this.approverConfig.properties.nodeDeptList = [];
      this.approverConfig.properties.nodePostList = [];
      this.approverConfig.properties.nodeRoleList = [];
      this.approverConfig.properties.workFlowRoleList = [];
    },
    changeType(val) {
      this.approverConfig.properties.nodeUserList = [];
      this.approverConfig.properties.nodeDeptList = [];
      this.approverConfig.properties.nodePostList = [];
      this.approverConfig.properties.nodeRoleList = [];
      this.approverConfig.properties.workFlowRoleList = [];
      this.approverConfig.properties.activateType =
        val === "targetUserId" ? "OR" : "AND";
      if (val == "targetWorkFlowRole" || val == "targetInitiatorPerson")
        // 工地新增功能
        this.approverConfig.properties.activateType = "OR";
      this.approverConfig.properties.noneActionerAction = "admin";
      if (val == 2) {
        this.approverConfig.directorLevel = 1;
      } else if (val == 4) {
        this.approverConfig.selectMode = 1;
        this.approverConfig.selectRange = 1;
      } else if (val == 7) {
        this.approverConfig.examineEndDirectorLevel = 1;
      }
    },
    setApproverStr(nodeConfig) {
      if (nodeConfig.properties.actionerType == "targetUserId") {
        if (nodeConfig.properties.nodeUserList.length == 1) {
          return nodeConfig.properties.nodeUserList[0].name;
        } else if (nodeConfig.properties.nodeUserList.length > 1) {
          if (nodeConfig.properties.activateType == "ONE_BY_ONE") {
            return nodeConfig.properties.nodeUserList
              .map((item) => {
                return item.name;
              })
              .toString();
          } else if (nodeConfig.properties.activateType == "AND") {
            return nodeConfig.properties.nodeUserList.length + "人会签";
          } else {
            return nodeConfig.properties.nodeUserList.length + "人或签";
          }
        }
      } else if (nodeConfig.properties.actionerType == "targetWorkFlowRole") {
        const workFlowRoleList = nodeConfig.properties.workFlowRoleList;
        const workFlowRoleListLength = workFlowRoleList.length;
        const activateType = nodeConfig.properties.activateType;
        if (workFlowRoleListLength == 1) {
          return workFlowRoleList[0].workFlowRoleName; // 流程角色名称
        } else if (workFlowRoleListLength > 1) {
          if (activateType == "AND") {
            return workFlowRoleListLength + "部门会签";
          } else {
            return workFlowRoleListLength + "部门或签";
          }
        }
      } else if (
        nodeConfig.properties.actionerType == "targetInitiatorPerson"
      ) {
        return "发起人";
      } else if (nodeConfig.properties.actionerType == "targetAllPerson") {
        return "所有人";
      } else if (nodeConfig.properties.actionerType == "targetDept") {
        const nodeDeptList = nodeConfig.properties.nodeDeptList;
        const nodeDeptListLength = nodeDeptList.length;
        const activateType = nodeConfig.properties.activateType;
        if (nodeDeptListLength == 1) {
          return nodeDeptList[0].label;
        } else if (nodeDeptListLength > 1) {
          if (activateType == "AND") {
            return nodeDeptListLength + "部门会签";
          } else {
            return nodeDeptListLength + "部门或签";
          }
        }
      } else if (nodeConfig.properties.actionerType == "targetPost") {
        const nodePostList = nodeConfig.properties.nodePostList;
        const nodeDeptListLength = nodePostList.length;
        const activateType = nodeConfig.properties.activateType;
        if (nodeDeptListLength == 1) {
          return nodePostList[0].postName;
        } else if (nodeDeptListLength > 1) {
          if (activateType == "AND") {
            return nodeDeptListLength + "岗位会签";
          } else {
            return nodeDeptListLength + "岗位或签";
          }
        }
      } else if (nodeConfig.properties.actionerType == "targetRole") {
        const nodeRoleList = nodeConfig.properties.nodeRoleList;
        const nodeRoleListLength = nodeRoleList.length;
        const activateType = nodeConfig.properties.activateType;
        if (nodeRoleListLength == 1) {
          return nodeRoleList[0].name; // 角色名称
        } else if (nodeRoleListLength > 1) {
          if (activateType == "AND") {
            return nodeRoleListLength + "角色会签";
          } else {
            return nodeRoleListLength + "角色或签";
          }
        }
      } else if (nodeConfig.properties.actionerType == 2) {
        let level =
          nodeConfig.directorLevel == 1
            ? "直接主管"
            : "第" + nodeConfig.directorLevel + "级主管";
        if (nodeConfig.properties.activateType == "ONE_BY_ONE") {
          return level;
        } else if (nodeConfig.properties.activateType == "AND") {
          return level + "会签";
        }
      } else if (nodeConfig.properties.actionerType == 4) {
        if (nodeConfig.selectRange == 1) {
          return "发起人自选";
        } else {
          if (nodeConfig.properties.nodeUserList.length > 0) {
            if (nodeConfig.selectRange == 2) {
              return "发起人自选";
            } else {
              return (
                "发起人从" +
                nodeConfig.properties.nodeUserList[0].roleName +
                "中自选"
              );
            }
          } else {
            return "";
          }
        }
      } else if (nodeConfig.properties.actionerType == 5) {
        return "发起人自己";
      } else if (nodeConfig.properties.actionerType == 7) {
        return (
          "从直接主管到通讯录中级别最高的第" +
          nodeConfig.examineEndDirectorLevel +
          "个层级主管"
        );
      }
    },
    setCheckerStr(nodeConfig) {
      const { nodeViewUserList } = nodeConfig.properties;
      if (nodeViewUserList && nodeViewUserList.length) {
        return this.arrToStr(nodeViewUserList);
      } else {
        return false;
      }
    },
    // 保存角色筛选
    saveApprover() {
      const { approvalNodeType, nodeDeptList, nodeRoleList, nodeUserList } =
        this.approverConfig.properties;
      if (approvalNodeType == "free") {
        if (
          !nodeDeptList.length &&
          !nodeRoleList.length &&
          !nodeUserList.length
        ) {
          this.approverConfig.properties.actionerType = "";
        }
      }

      const actionerType = this.approverConfig.properties.actionerType;
      if (
        this.approverConfig.type == "start" &&
        actionerType != "targetAllPerson"
      ) {
        let key;
        let title;
        switch (actionerType) {
          case "targetUserId":
            key = "nodeUserList";
            title = "成员";
            break;
          case "targetDept":
            key = "nodeDeptList";
            title = "部门";
            break;
          case "targetPost":
            key = "nodePostList";
            title = "岗位";
            break;
          case "targetRole":
            key = "nodeRoleList";
            title = "角色";
            break;
          case "targetWorkFlowRole":
            key = "workFlowRoleList";
            title = "流程角色";
            break;
          default:
            break;
        }
        if (this.approverConfig.properties[key].length < 1) {
          this.msgWarning(`最少选择一个${title}`);
          return;
        }
      }
      if (this.approverConfig.properties.rejectType) {
        if (
          this.approverConfig.properties.rejectNodeId == "" ||
          this.approverConfig.properties.rejectNodeId == undefined
        ) {
          this.msgWarning(`请选择一个自定义节点`);
          return;
        }
      }
      this.approverConfig.error = false; //
      this.$emit("update:nodeConfig", this.approverConfig);
      this.approverDrawer = false;
    },
    savePromoter() {
      this.$emit("update:flowPermission", this.flowPermission1);
      this.promoterDrawer = false;
    },
    arrToStr(arr) {
      if (arr) {
        return arr
          .map((item) => {
            return item.name;
          })
          .toString();
      }
    },
    toggleStrClass(item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : [];
      return a.some((item) => {
        return item == key;
      });
    },
    toStrChecked(item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : [];
      var isIncludes = this.toggleStrClass(item, key);
      if (!isIncludes) {
        a.push(key);
        item.zdy1 = a.toString();
      } else {
        this.removeStrEle(item, key);
      }
    },
    removeStrEle(item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : [];
      var includesIndex;
      a.map((item, index) => {
        if (item == key) {
          includesIndex = index;
        }
      });
      a.splice(includesIndex, 1);
      item.zdy1 = a.toString();
    },
    toggleClass(arr, elem, key = "id") {
      return arr.some((item) => {
        return item[key] == elem[key];
      });
    },
    toChecked(arr, elem, key = "id") {
      var isIncludes = this.toggleClass(arr, elem, key);
      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
    },
    removeEle(arr, elem, key = "id") {
      var includesIndex;
      arr.map((item, index) => {
        if (item[key] == elem[key]) {
          includesIndex = index;
        }
      });
      arr.splice(includesIndex, 1);
    },
    getRoleList() {
      this.$axios.get(`${process.env.BASE_URL}roles.json`).then((res) => {
        this.roles = res.data.list;
      });
    },
    getDepartmentList(parentId = 0) {
      this.$axios
        .get(`${process.env.BASE_URL}departments.json?parentId=${parentId}`)
        .then((res) => {
          this.departments = res.data;
        });
    },
    delNode() {
      this.$emit("update:nodeConfig", this.nodeConfig.childNode);
    },
    addTerm() {
      let len = this.nodeConfig.conditionNodes.length + 1;
      this.nodeConfig.conditionNodes.push({
        name: "条件" + len,
        type: "condition",
        priorityLevel: len,
        properties: {
          nodeUserList: [],
          nodeDeptList: [],
          nodePostList: [],
          nodeRoleList: [],
          workFlowRoleList: [],
          conditions: [],
        },
        childNode: null,
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit("update:nodeConfig", this.nodeConfig);
    },
    delTerm(index) {
      this.nodeConfig.conditionNodes.splice(index, 1);
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit("update:nodeConfig", this.nodeConfig);
      if (this.nodeConfig.conditionNodes.length == 1) {
        if (this.nodeConfig.childNode) {
          if (this.nodeConfig.conditionNodes[0].childNode) {
            this.reData(
              this.nodeConfig.conditionNodes[0].childNode,
              this.nodeConfig.childNode,
            );
          } else {
            this.nodeConfig.conditionNodes[0].childNode =
              this.nodeConfig.childNode;
          }
        }
        this.$emit(
          "update:nodeConfig",
          this.nodeConfig.conditionNodes[0].childNode,
        );
      }
    },
    reData(data, addData) {
      if (!data.childNode) {
        data.childNode = addData;
      } else {
        this.reData(data.childNode, addData);
      }
    },
    setPerson(priorityLevel) {
      const { type } = this.nodeConfig;
      if (type == "start") {
        this.approverDrawer = true;
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig));
        if (this.approverConfig.properties.actionerType == "targetWorkFlowRole")
          this.processRole =
            this.approverConfig.properties.workFlowRoleList[0].workFlowRoleName;
        this.approverConfig.properties.actionerType = this.approverConfig
          .properties.actionerType
          ? this.approverConfig.properties.actionerType
          : 1;
        // this.flowPermission1 = this.flowPermission;
      } else if (type == "approver") {
        this.approverDrawer = true;
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig));
        if (this.approverConfig.properties.actionerType == "targetWorkFlowRole")
          this.processRole =
            this.approverConfig.properties.workFlowRoleList[0].workFlowRoleName;
        this.approverConfig.properties.actionerType = this.approverConfig
          .properties.actionerType
          ? this.approverConfig.properties.actionerType
          : 1;
      } else if (type == "notifier") {
        this.copyerDrawer = true;
        this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig));
        this.ccSelfSelectFlag =
          this.copyerConfig.ccSelfSelectFlag == 0
            ? []
            : [this.copyerConfig.ccSelfSelectFlag];
      } else {
        this.conditionDrawer = true;
        this.bPriorityLevel = priorityLevel;
        this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig));
        this.conditionConfig =
          this.conditionsConfig.conditionNodes[priorityLevel - 1];
      }
    },
    arrTransfer(index, type = 1) {
      //向左-1,向右1
      this.nodeConfig.conditionNodes[index] =
        this.nodeConfig.conditionNodes.splice(
          index + type,
          1,
          this.nodeConfig.conditionNodes[index],
        )[0];
      this.nodeConfig.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1;
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit("update:nodeConfig", this.nodeConfig);
    },
    handleConditionDictChange(option, item) {
      item.dictLabel = option.label;
      item.zdy1 = option.value;
    },
    conditionDictFormatData(res, item) {
      const dict = res.data;
      item.dict = dict;
      return dict.map((data) => ({
        ...data,
        label: data.name,
        value: data.code,
        // label: data.dictLabel,
        // value: data.dictValue,
      }));
    },
    // 是否驳回开关
    rejectChange(val) {
      if (val) {
        if (this.approverConfig.properties.rejectType == undefined) {
          this.$set(this.approverConfig.properties, "rejectType", 0);
        }
      }
    },
    // 驳回节点选择 allNode
    rejectNode(val) {
      if (val) {
        this.allNodeList = getNodeId(this.allNode, this.approverConfig);
      } else {
        this.approverConfig.properties.rejectNodeId = "";
      }
    },
  },
};
</script>

<style>
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}

.add-node-popover-body {
  display: flex;
}

.promoter_content {
  padding: 0 20px;
}

.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
  margin-bottom: 20px;
}

.promoter_content p {
  padding: 18px 0;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}

.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}

.person_body {
  border: 1px solid #f5f5f5;
  height: 500px;
}

.person_tree {
  padding: 10px 12px 0 8px;
  width: 280px;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}

.person_tree input {
  padding-left: 22px;
  width: 210px;
  height: 30px;
  font-size: 12px;
  border-radius: 2px;
  border: 1px solid #d5dadf;
  background: url(~@/assets/images/approval/list_search.png) no-repeat 10px
    center;
  background-size: 14px 14px;
  margin-bottom: 14px;
}

.tree_nav span {
  display: inline-block;
  padding-right: 10px;
  margin-right: 5px;
  max-width: 6em;
  color: #38adff;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/approval/jiaojiao.png) no-repeat right center;
}

.tree_nav span:last-of-type {
  background: none;
}

.person_tree ul,
.has_selected ul {
  height: 420px;
  overflow-y: auto;
}

.person_tree li {
  padding: 5px 0;
}

.person_tree li i {
  float: right;
  padding-left: 24px;
  padding-right: 10px;
  color: #3195f8;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/approval/next_level_active.png) no-repeat
    10px center;
  border-left: 1px solid rgb(238, 238, 238);
}

.person_tree li a.active + i {
  color: rgb(197, 197, 197);
  background-image: url(~@/assets/images/approval/next_level.png);
  pointer-events: none;
}

.person_tree img {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}

.has_selected {
  width: 276px;
  height: 100%;
  font-size: 12px;
}

.has_selected ul {
  height: 460px;
}

.has_selected p {
  padding-left: 19px;
  padding-right: 20px;
  line-height: 37px;
  border-bottom: 1px solid #f2f2f2;
}

.has_selected p a {
  float: right;
}

.has_selected ul li {
  margin: 11px 26px 13px 19px;
  line-height: 17px;
}

.has_selected li span {
  vertical-align: middle;
}

.has_selected li img:first-of-type {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}

.has_selected li img:last-of-type {
  float: right;
  margin-top: 2px;
  width: 14px;
}

el-radio-group {
  padding: 20px 0;
}

.approver_content {
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f2f2;
}

.approver_content .el-radio,
.approver_some .el-radio,
.approver_self_select .el-radio {
  width: 20%;
  margin-bottom: 20px;
}

.copyer_content .el-checkbox {
  margin-bottom: 20px;
}

.el-checkbox__label {
  font-size: 12px;
}

.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_content,
.approver_some {
  padding: 20px 20px 0;
}

.approver_manager p:first-of-type,
.approver_some p {
  line-height: 19px;
  font-size: 14px;
  margin-bottom: 14px;
}

.approver_manager p {
  line-height: 32px;
}

.approver_manager select {
  width: 420px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.approver_manager p.tip {
  margin: 10px 0 22px 0;
  font-size: 12px;
  line-height: 16px;
  color: #f8642d;
}

.approver_self {
  padding: 28px 20px;
}

.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}

.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}

.approver_self_select h3 {
  margin: 5px 0 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
}

.condition_copyer .el-drawer__body .priority_level {
  position: absolute;
  top: 11px;
  right: 30px;
  width: 100px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.condition_content p.tip {
  margin: 20px 0;
  width: 510px;
  text-indent: 17px;
  line-height: 45px;
  background: rgba(241, 249, 255, 1);
  border: 1px solid rgba(64, 163, 247, 1);
  color: #46a6fe;
  font-size: 14px;
}

.condition_content ul {
  max-height: 500px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.condition_content li > span {
  float: left;
  margin-right: 8px;
  width: 70px;
  line-height: 32px;
  text-align: right;
}

.condition_content li > div {
  display: inline-block;
  width: 370px;
}

.condition_content li:not(:last-child) > div > p {
  margin-bottom: 20px;
}

.condition_content li > div > p:not(:last-child) {
  margin-bottom: 10px;
}

.condition_content li > a {
  float: right;
  margin-right: 10px;
  margin-top: 7px;
}

.condition_content li select,
.condition_content li input {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.condition_content li select + input {
  width: 220px;
}

.condition_content li select {
  margin-right: 10px;
  width: 100px;
}

.condition_content li p.selected_list {
  padding-left: 10px;
  border-radius: 4px;
  min-height: 32px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.condition_content li p.check_box {
  line-height: 32px;
}

.condition_list .el-dialog__body {
  padding: 16px 26px;
}

.condition_list p {
  color: #666666;
  margin-bottom: 10px;
}

.condition_list p.check_box {
  margin-bottom: 0;
  line-height: 36px;
}
.switch-container {
  font-size: 14px;
  margin: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f2f2f2;
}
.switch-container .reject-switch {
  margin-bottom: 10px;
}
.demo-drawer__footer {
  margin: 10px;
}
.approverDrawer {
  overflow: auto !important;
}
.approverText {
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
