// Transforms a quest event uid into the name
function getEventName(eventRef)
{
    let event = Global.events[eventRef.m_eventUID];
    if (event)
        return `${event.Name} (${eventRef.m_eventUID})`;
    else
        return eventRef.m_eventUID;
}

function getStatementText(statement)
{
    if (statement)
        return `${statement._text} (${statement._meta})`; //TODO: some statements dont have meta tags
    else
        return "undefined"; //TODO: happens?
}

// Helper to parse an action list cause QuestStep also wants those
function parseActionList(node)
{
    ret = "Actions: \n";
    let actions = node.actions;
    if (actions.length > 1)
    {
        let execution = node.executionMode == "ActionsRunInParallel" ? "Parallel" : "Sequence"; // defaults to sequence
        ret += "Execution: In" + execution + "\n";
    }
    
    // get action text for each action
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        ret += "- " + getActionNodeText(action) + "\n";
    };
    return ret;
}
// Helper to parse an action list cause ConcurrentState also wants those
function parseConditionList(node)
{
    ret = "Conditions: \n";
    let list = node.conditions;
    if (list.length > 1)
    {
        let checkMode = list.checkMode == "AnyTrueSuffice" ? "ANY True" : "ALL True"; // defaults to AllTrueRequired
        ret += `CheckMode: ${checkMode}\n`;
    }
    if (list != null) {
        for (let i = 0; i < list.length; i++) {
            let subCondition = list[i];
            ret += "- " + getConditionText(subCondition) + "\n";
        };
    }
    return ret;
}

// BBParameter<T> parsers
function parseBBParamGameObject(obj)
{
    return obj._name ?? `GameObject ${obj._value}`; //TODO: how 2. some use _value instead
}
//TODO: BBParameter<Quest> in Condition_KnowQuest
function parseBBParamBool(val)
{
    // defaults to True, false _value isn't serialized, else use val
    return val == null ? "True" : (val._value == null ? "False" : val._value);
}

function getActionNodeText(node)
{
    ret = "";
    console.debug("ActionNode: " + node.$type);
    console.debug(node);
    switch (node.$type) {
        case "NodeCanvas.Framework.ActionList":
        {
            ret += parseActionList(node);
            break;
        }
        case "NodeCanvas.Tasks.Actions.SendQuestEvent":
        {
            ret = "SendQuestEvent: ";
            ret += getEventName(node.QuestEventRef);
            break;
        }
        case "NodeCanvas.Tasks.Actions.RemoveQuestEvent":
        {
            ret = "RemoveQuestEvent: ";
            ret += getEventName(node.QuestEventRef);
            if (node.RemoveAllStack != null && node.RemoveAllStack)
                ret += " (Remove All)";
            break;
        }
        case "NodeCanvas.Tasks.Actions.GiveReward":
        {
            ret = "GiveReward: ";
            ret += `Silver: ${node.SilverAmount._value ?? 0}, `;
            ret += `XP: ${node.XpAmount._value ?? 0}, `;
            ret += "Items: ";
            for (let i = 0; i < node.ItemReward.length; i++)
            {
                let reward = node.ItemReward[i];
                ret += `${reward.Quantity._value}x ${reward.Item._value.m_itemID}, `
            }
            break;
        }
        case "NodeCanvas.Tasks.Actions.BranchDialogue":
        {
            ret = "BranchDialogue: ";
            ret += node.dialogueStarter._name;
            break;
        }
        case "NodeCanvas.Tasks.Actions.QuestAction_AddLogEntry":
            ret += "AddLogEntry: ";
            ret += getStatementText(node.statement);
            break;
        case "NodeCanvas.Tasks.Actions.SetBoolean":
            ret += "SetBoolean: ";
            ret += node.boolVariable._name;
            ret += " = "
            ret += node.setTo ?? "True"; // defaults to true
            break;
        case "NodeCanvas.Tasks.Actions.SetObjectActive":
        {
            ret += "SetObjectActive: ";
            //TODO: overrideAgent is TaskAgentParameter : BBParameter<UnityEngine.Object>, so GameObject should be the same?
            ret += `Set ${parseBBParamGameObject(node.overrideAgent)} to ${node.setTo}`
            break;
        }
        case "NodeCanvas.Tasks.Actions.SetActiveGameObject":
        {
            ret = "SetActiveGameObject: ";
            ret += `Set ${parseBBParamGameObject(node.Target)} to ${parseBBParamBool(node.IsActive)}`;
            break;
        }
        default:
            ret += node.$type;
            break;
    }
    return ret;
}

function getNodeText(node) {
    var ret = "";
    console.debug("Node: " + node.$type);
    console.debug(node);
    switch (node.$type) {
        case "NodeCanvas.StateMachines.QuestStep":
        {
            ret = "QuestStep: \n";
            if (node._actionList != null)
                ret += parseActionList(node._actionList);
            break;
        }
        case "NodeCanvas.StateMachines.ConcurrentState":
        {
            ret = "ConcurrentState: \n";
            if (node._conditionList != null)
                ret += parseConditionList(node._conditionList);
            if (node._actionList != null)
                ret += parseActionList(node._actionList);
            break;
        }
        // Dialogue
        case "NodeCanvas.BehaviourTrees.ConditionNode":
        case "NodeCanvas.DialogueTrees.ConditionNode":
        {
            ret = "ConditionNode: \n";
            let condition = node._condition;
            if (condition) {
                ret += getConditionText(condition);
            }
            break;
        }
        case "NodeCanvas.BehaviourTrees.ActionNode":
        case "NodeCanvas.DialogueTrees.ActionNode":
        {
            ret = "ActionNode: \n";
            let action = node._action;
            if (action) {
                ret += getActionNodeText(action);
            }
            break;
        }
        case "NodeCanvas.DialogueTrees.FinishNode":
            ret = "FinishNode: (";
            ret += node.finishState ?? "Success"; // defaults to success // Example Failure in data/dialogues/merchants/Dialogue_Merchant_CaravanFastTravel.json
            ret += ")";
            break;
        case "NodeCanvas.DialogueTrees.StatementNodeExt":
            ret = "StatementNode: \n";
            if (node.statement)
            {
                ret += getStatementText(node.statement);
            }
            break;
        case "NodeCanvas.DialogueTrees.MultipleChoiceNodeExt":
        {
            ret = "MultipleChoiceNode: \n";
            let list = node.availableChoices;
            if (list != null) {
                ret += "Choices: \n";
                for (let i = 0; i < list.length; i++) {
                    let statement = list[i];
                    ret += "- " + getStatementText(statement.statement) + "\n";
                };
            }
            break;
        }
        case "NodeCanvas.BehaviourTrees.BinarySelector":
        {
            ret = "BinarySelector: \n";
            let condition = node._condition;
            if (condition) {
                ret += getConditionText(condition);
            }
            break;
        }
        case "NodeCanvas.DialogueTrees.GoToNode":
        {
            ret = "GoToNode";
            let source = node.$id;
            let target = node._targetNode.$ref ?? node._targetNode.$id;
            node.CUSTOM.connections.push({"source": source, "target": target});
            break;
        }
        case "NodeCanvas.DialogueTrees.Jumper":
        {
            ret = "Jumper";
            let source = node.$id;
            let target = node._sourceNodeUID;
            node.CUSTOM.connections.push({"source": source, "target": target});
            break;
        }
        default:
            ret += node.$type;
            break;
    }
    return ret;
}

function getConditionText(condition) {
    var ret = "";
    console.debug("Condition: " + condition.$type);
    console.debug(condition);
    if (condition._invert != null && condition._invert == true)
    {
        ret += "! ";
    }
    switch (condition.$type) {
        case "NodeCanvas.Framework.ConditionList":
        {
            ret += parseConditionList(condition);
            break;
        }
        case "NodeCanvas.Tasks.Conditions.Condition_QuestEventOccured":
        {
            ret += "QuestEventOccured: ";
            ret += getEventName(condition.QuestEventRef);
            break;
        }
        case "NodeCanvas.Tasks.Conditions.CheckBoolean":
        {
            ret += "CheckBoolean: ";
            ret += `${condition.valueA._name} == ${parseBBParamBool(condition.valueB)}`;
            break;
        }
        case "NodeCanvas.Tasks.Conditions.Condition_CheckQuestEventExpiry":
        {
            ret += "CheckQuestEventExpiry: ";
            ret += getEventName(condition.QuestEventRef);
            ret += ` >= ${condition.ExpiryTime} hours?`
            break;
        }
        default:
            ret = condition.$type;
            break;
    }
    return ret;
}

function getEdgeText(edge) {
    var ret = "";
    console.debug("Edge: " + edge.$type);
    console.debug(edge);
    switch (edge.$type) {
        case "NodeCanvas.StateMachines.FSMConnection":
            ret = "FSMConnection: \n";
            let condition = edge._condition;
            if (condition) {
                ret += getConditionText(condition);
            }
            else
            {
                ret = "";
            }
            break;
        case "NodeCanvas.DialogueTrees.DTConnection":
            //ret = "DTConnection"; // nothing else
            break;
        case "NodeCanvas.BehaviourTrees.BTConnection":
            //ret = "BTConnection"; // nothing else
            break;
        default:
            ret += edge.$type;
            break;
    }
    return ret;
}