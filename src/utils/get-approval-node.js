// 审批模板拿节点ID
export function getNodeId(parentObj, nodeObj, nodeIdList = []) {
  // console.log(parentObj, "item");
  // if (parentObj.childNode == null) return;
  if (parentObj["nodeId"] == nodeObj["nodeId"]) {
    return nodeIdList; // 返回nodeIdList
  }
  if (parentObj.type == "start") {
    if (
      parentObj.conditionNodes instanceof Array &&
      parentObj.conditionNodes.length > 0
    ) {
      parentObj.conditionNodes.forEach((item) => {
        getNodeId(item, nodeObj, nodeIdList);
      });
    } else {
      getNodeId(parentObj.childNode, nodeObj, nodeIdList);
    }
  } else if (parentObj.type == "approver") {
    if (parentObj.properties.actionerType == "targetInitiatorPerson") {
      nodeIdList.push({
        value: parentObj.nodeId,
        label: "发起人",
      });
    } else {
      nodeIdList.push({
        value: parentObj.nodeId,
        label: getNodeLabelName(parentObj),
      });
    }
    if (parentObj.childNode) {
      getNodeId(parentObj.childNode, nodeObj, nodeIdList);
    }
  } else if (parentObj.type == "route") {
    parentObj.conditionNodes.forEach((item) => {
      getNodeId(item, nodeObj, nodeIdList);
    });

    parentObj.childNode && getNodeId(parentObj.childNode, nodeObj, nodeIdList);
  } else if (parentObj.type == "condition") {
    if (parentObj.childNode != null)
      getNodeId(parentObj.childNode, nodeObj, nodeIdList);
  }
  return nodeIdList;
}
function getNodeLabelName(parentObj) {
  let key;
  let keys = "name";
  const activateType = parentObj.properties.activateType;
  switch (parentObj.properties.actionerType) {
    case "targetUserId":
      key = "nodeUserList";
      keys = "nickname";
      break;
    case "targetDept":
      key = "nodeDeptList";
      keys = "label";
      break;
    case "targetRole":
      key = "nodeRoleList";
      break;
    case "targetWorkFlowRole":
      key = "workFlowRoleList";
      keys = "workFlowRoleName";
      break;
    default:
      break;
  }
  const nodeListLength = parentObj.properties[key].length;
  if (nodeListLength == 1) {
    return parentObj.properties[key][0][keys];
  } else if (nodeListLength > 1) {
    if (activateType == "AND" || activateType == "OR") {
      let name;
      switch (key) {
        case "nodeUserList":
          name = activateType == "AND" ? "人会签" : "人或签";
          break;
        case "nodeDeptList":
          name = activateType == "AND" ? "部门会签" : "部门或签";
          break;
        default:
          name = activateType == "AND" ? "角色会签" : "角色或签";
          break;
      }
      return nodeListLength + name;
    } else {
      let itemName = "";
      parentObj.properties[key].forEach((item, idx) => {
        if (idx) {
          itemName = itemName + "," + item[keys];
        } else {
          itemName = itemName + item[keys];
        }
      });
      return itemName;
    }
  } else {
    return "";
  }
}
