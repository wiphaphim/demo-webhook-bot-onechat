const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
// const Onechat = require("./dbConfig");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("*", (req, res) => {
  res.send("test webhook onechat");
});

const responseUser = async (url, playload) => {
  let config = {
    method: "post",
    url: url,
    headers: {
      Authorization:
        "Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719",
      "Content-Type": "application/json",
    },
    data: playload,
  };
  let result = await axios(config).catch((error) => console.log(error));
  console.log("result ===>", result.data);
};


app.post("/", async (req, res) => {
  try {
    console.log("req.body ===>", req.body);

    const user_id = req.body.source.user_id;
    console.log("user_id ===>", user_id);

    const bot_id = req.body.bot_id;
    console.log("bot_id ===>", bot_id);
    
    const text = req.body.message.text
    console.log("text ===>", text);

    const display_name = req.body.source.display_name
    console.log("display_name ===>", display_name);

    let playload
    let url

    playload = JSON.stringify({
      to: user_id,
      bot_id: bot_id,
      message: "คุณต้องการทำรายการใด",
      quick_reply: [
        {
          label: "ลงทะเบียน",
          type: "text",
          message: "ลงทะเบียน",
          payload: {"menu":"regis", "next": "device_type"},
        },
        {
          label: "แก้ไข",
          type: "text",
          message: "แก้ไข",
          payload: {"menu":"edit", "next": "device_type"},
        },
        {
          label: "ลบข้อมูล",
          type: "text",
          message: "ลบข้อมูล",
          payload: {"menu":"delete", "next": "device_type"},
        },
      ],
    });

    url = "https://chat-api.one.th/message/api/v1/push_quickreply";    

    const requestName = async() => {
        console.log(">>>>>>>>>>>>>>>>>>>>> กรุณากรอกชื่อ Device <<<<<<<<<<<<<<<<<<<<<<<");
  
        // playload = JSON.stringify({
        //     "to": user_id,
        //     "bot_id": bot_id,
        //     "type" : "text",
        //     "message" : 'กรุณากรอกชื่อ Device',
        //     "custom_notification" : "กรุณากรอกชื่อ Device"
        // })
  
        // url =  'https://chat-api.one.th/message/api/v1/push_message'
  
        // responseUser(url, playload) 
        playload = JSON.stringify({
          to: user_id,
          bot_id: bot_id,
          message: "คุณต้องการทำรายการใด",
          quick_reply: [
            {
              label: "name1",
              type: "text",
              message: "name1",
              payload: {"menu":"regis", "next": "end"},
            },
            {
              label: "name2",
              type: "text",
              message: "name2",
              payload: {"menu":"regis", "next": "end"},
            },
            {
              label: "name3",
              type: "text",
              message: "name3",
              payload: {"menu":"regis", "next": "end"},
            },
          ],
        });
    
        url = "https://chat-api.one.th/message/api/v1/push_quickreply";   
    }

    const insertName = async() => {
      console.log(">>>>>>>>>>>>>>>>>>>>> register device name <<<<<<<<<<<<<<<<<<<<<<<");
      let device_name = text
      console.log("device_name ===>", device_name);
      console.log("display_name ===>", display_name);

      let update_type = await Accounts.updateOne(
        {display_name: display_name},
        {
          $set: {
            name: device_name
          }
        }
      ).catch(err => console.log(err))

      if(!update_type) {
        console.log("cannot insert device name!");
      } else {
        let playload = JSON.stringify({
            "to": user_id,
            "bot_id": bot_id,
            "type" : "text",
            "message" : 'ลงทะเบียนสำเร็จ',
            "custom_notification" : "ลงทะเบียนสำเร็จ"
        })

        let url =  'https://chat-api.one.th/message/api/v1/push_message'

        await responseUser(url, playload)

        playload = JSON.stringify({
            "to": user_id,
            "bot_id": bot_id,
            "message" : "ต้องการทำรายการอื่นหรือไม่",
            "quick_reply" : [
                {
                    "label" : "ใช่",
                    "type" : "text",
                    "message" : "ใช่",
                    "payload" : "ใช่"
                },
                {
                    "label" : "ไม่",
                    "type" : "text",
                    "message" : "ไม่",
                    "payload" : "ไม่"
                },
            ]
        });

        url = 'https://chat-api.one.th/message/api/v1/push_quickreply'

        await responseUser(url, playload)
      } 
    }

    const requestType = async() => {
      console.log(">>>>>>>>>>>>>>>>>>>>> register device type <<<<<<<<<<<<<<<<<<<<<<<");
      playload = JSON.stringify({
        to: user_id,
        bot_id: bot_id,
        message: "กรุณาเลือกชนิดของ Device",
        quick_reply: [
          {
            label: "weapon",
            type: "text",
            message: "weapon",
            payload:{"menu": "regis", "next":"device_name",}, 
          },
          {
            label: "tpye2",
            type: "text",
            message: "tpye2",
            payload:{"menu": "regis", "next":"device_name",}, 
          },
          {
            label: "tpye3",
            type: "text",
            message: "tpye3",
            payload:{"menu": "regis", "next":"device_name",}, 
          },
        ],
      });
  
      url = "https://chat-api.one.th/message/api/v1/push_quickreply";
    }

    const insertType = async() => {
      // const add_type = Accounts({
      //   device_id: uuidv4(),
      //   user_id : user_id,
      //   type: text,
      //   status: "bound",
      //   ownership: display_name
      // })
      // const save_type = await add_type.save()
      // .catch(err => console.log(err))
      // console.log("save_type ===>", save_type);
      console.log("<----------------- insert type success -------------------->");

    }

    const requestEdit = () => {
      console.log(">>>>>>>>>>>>>>>>>>>>> request edit <<<<<<<<<<<<<<<<<<<<<<<");
      playload = JSON.stringify({
        to: user_id,
        bot_id: bot_id,
        message: "กรุณาเลือกรายการที่ต้องการแก้ไข",
        quick_reply: [
          {
            label: "device name",
            type: "text",
            message: "edit_device_name",
            payload: "edit_device_name",
          },
          {
            label: "device type",
            type: "text",
            message: "edit_device_type",
            payload: "edit_device_type",
          },
          {
            label: "device staus",
            type: "text",
            message: "edit_device_staus",
            payload: "edit_device_staus",
          },
        ],
      });
  
      url = "https://chat-api.one.th/message/api/v1/push_quickreply";

      responseUser(url, playload) 
    }

    const updateDevice = async() => {
      let update_device
      if (req.body.message.data === 'edit_device_name') {
        update_device = await Accounts.updateOne(
          {display_name: display_name},
          {
            $set: {
              name: text
            }
          }
        ).catch(err => console.log(err))
      } else if (req.body.message.data === 'edit_device_type') {
        update_device = await Accounts.updateOne(
          {display_name: display_name},
          {
            $set: {
              type: text
            }
          }
        ).catch(err => console.log(err))
      } else if (req.body.message.data === 'edit_device_status') {
        update_device = await Accounts.updateOne(
          {display_name: display_name},
          {
            $set: {
              status: text
            }
          }
        ).catch(err => console.log(err))
      }
      
      if(!update_device) {
        console.log("cannot insert device name!");
      } else {
        let playload = JSON.stringify({
            "to": user_id,
            "bot_id": bot_id,
            "type" : "text",
            "message" : 'ลงทะเบียนสำเร็จ',
            "custom_notification" : "ลงทะเบียนสำเร็จ"
        })

        let url =  'https://chat-api.one.th/message/api/v1/push_message'

        await responseUser(url, playload)
      } 
    }

    const requestDelete = () => {
      const device_list = Accounts.find({user_id: user_id})
      .catch(err => console.log(err))
      device_list.forEach(i => {
        let device = i

      });
    }

    if(req.body.message.data != undefined) {
      console.log("req.body.message.data.menu ===>", req.body.message.data.menu);
      if (req.body.message.data.menu === 'regis') {
        if (req.body.message.data.next === 'device_type') {
          requestType()
        } else if (req.body.message.data.next === 'device_name') {
          await insertType()
          await requestName()
        } else if (req.body.message.data.next === 'end') {
          console.log(">>>>>>>>>>>>>>>>>>>>> regis end <<<<<<<<<<<<<<<<<<<<<<");
          playload = JSON.stringify({
              "to": user_id,
              "bot_id": bot_id,
              "type" : "text",
              "message" : 'การลงทะเบียนสำเร็จ',
              "custom_notification" : "การลงทะเบียนสำเร็จ"
          })
          url =  'https://chat-api.one.th/message/api/v1/push_message'
          await responseUser(url, playload)
          playload = {
            user_id: user_id,
            bot_id: bot_id,
          };
          url = "https://chat-api.one.th/alpine/api/v1/switchKeyboard";
        } else {
          playload = JSON.stringify({
              "to": user_id,
              "bot_id": bot_id,
              "type" : "text",
              "message" : 'กรุณาเลือกจากรายการ',
              "custom_notification" : "กรุณาเลือกจากรายการ"
          })
          url =  'https://chat-api.one.th/message/api/v1/push_message'
        }
      } else if (req.body.message.data.menu === 'edit'){
        console.log("edit");
      } else if (req.body.message.data.menu === 'delete'){
        console.log("delete");
      } else {
        playload = JSON.stringify({
            "to": user_id,
            "bot_id": bot_id,
            "type" : "text",
            "message" : 'กรุณาเลือกจากรายการ',
            "custom_notification" : "กรุณาเลือกจากรายการ"
        })
        url =  'https://chat-api.one.th/message/api/v1/push_message'
        await responseUser(url, playload)
      } 
    }
     
    if (req.body.message.text === "ไม่") {
      console.log(">>>>>>>>>>>>>>>>>>>>> no <<<<<<<<<<<<<<<<<<<<<<<");
      playload = {
        user_id: user_id,
        bot_id: bot_id,
      };
      url = "https://chat-api.one.th/alpine/api/v1/switchKeyboard";
    } 

    await responseUser(url, playload);
    res.send("test webhook onechat ");
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on 3000 port!`)
);
