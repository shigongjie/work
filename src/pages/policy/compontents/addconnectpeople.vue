<template>
  <div class="all">
    <el-tree
      :data="datas"
      show-checkbox
      default-expand-all
      node-key="key"
      ref="tree"
      @check="test"
      @check-change="test1"
      highlight-current
      :props="defaultProps"
      :filter-node-method="filterNode"
    ></el-tree>
    <div class="hasChoosedPeople">
      <div class="sgj">
        <el-input placeholder="输入用户名搜索" v-model="filterText"></el-input>
        <el-tag
          v-for="(item,index) in choosedPeople"
          :class="{'isTitle':item.children}"
          :key="index"
          :closable="!item.children"
          type="info"
          @close="handleClose(item.key)"
        >{{item.label}}</el-tag>
      </div>
      <div class="btnWarp">
        <el-button type="primary" @click="chooseOk()">选好了</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { isShowConnectPeople: "", businessType: Number },
  name: "addconnectpeople",
  data() {
    return {
      filterText: "",
      baseUser: "",
      defaultProps: {
        children: "children",
        label: "label",
        disable: true
      },
      datas: [],
      choosedPeople: [],
      sgj: [],
      giveTofather: {
        isShowConnectPeopleDialog: false,
        members: [],
        indexs: "sss",
        copierList: []
      },
      giveTofatherCopyList: {
        isShowConnectPeopleDialog: false,
        copierList: []
      },
      giveTofatherCheckedList: {
        isShowConnectPeopleDialog: false,
        checkedList: []
      },
      giveTofatherCoopList: {
        isShowConnectPeopleDialog: false,
        coopList: []
      }
    };
  },
  watch: {
    isShowConnectPeople(val) {
      this.resetConnect();
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.baseUser = JSON.parse(localStorage.getItem("userInfo")).userId;
    this.listDepartmentAndUser();
  },
  methods: {
    // 获取部门人
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.datas = d.data;
        this.isLoad = true;
        // 判断是否创建人本人
        // this.datas.forEach(items => {
        //   if (items.children) {
        //     items.children.forEach(list => {
        //       if (list.value == this.baseUser) {
        //         list.disabled = true;
        //         // arr.push(list.key);
        //       }
        //       if (list.children) {
        //         list.children.forEach(third => {
        //           if (third.children) {
        //             third.children.forEach(forth => {
        //               if (forth.value == this.baseUser) {
        //                 forth.disabled = true;
        //               }
        //             });
        //           }
        //           if (third.value == this.baseUser) {
        //             third.disabled = true;
        //           }
        //         });
        //       }
        //     });
        //   }
        // });
        this.resetConnect();
      }
    },
    resetConnect() {
      if (this.$props.isShowConnectPeople.type == "审批") {
        let arr = [];
        if (this.$props.isShowConnectPeople.group.members) {
          this.$props.isShowConnectPeople.group.members.forEach(item => {
            this.datas.forEach(items => {
              if (items.children) {
                items.children.forEach(list => {
                  if (list.children) {
                    list.children.forEach(third => {
                      // disi
                      if (third.children) {
                        third.children.forEach(forth => {
                          if (forth.value == item.userId) {
                            forth.disabled = true;
                            arr.push(forth.key);
                          }
                        });
                      }
                      if (third.value == item.userId) {
                        third.disabled = true;
                        arr.push(third.key);
                      }
                    });
                  }
                  if (list.value == item.userId) {
                    list.disabled = true;
                    arr.push(list.key);
                  }
                });
              }
            });
          });
        }
        this.$props.isShowConnectPeople.Allgroup.forEach(item => {
          if (item.members) {
            item.members.forEach(itemss => {
              this.datas.forEach(items => {
                if (items.children) {
                  items.children.forEach(list => {
                    if (list.children) {
                      list.children.forEach(third => {
                        if (third.value == itemss.userId) {
                          third.disabled = true;
                          // arr.push(list.key);
                        }
                      });
                    }
                    if (list.value == itemss.userId) {
                      list.disabled = true;
                      // arr.push(list.key);
                    }
                  });
                }
              });
            });
          }
        });
        this.$refs.tree.setCheckedKeys(arr);
        this.choosedPeople = this.$refs.tree.getCheckedNodes(true, true);
        this.choosedPeople = this.uniqueobj(this.choosedPeople);
      } else if (this.$props.isShowConnectPeople.type == "抄送") {
        let arr = [];
        // console.log(this.isShowConnectPeople)
        this.$props.isShowConnectPeople.Allgroup.forEach(item => {
          if (item.members) {
            item.members.forEach(itemss => {
              this.datas.forEach(items => {
                if (items.children) {
                  items.children.forEach(list => {
                    if (list.children) {
                      list.children.forEach(third => {
                        if (third.value == itemss.userId) {
                          third.disabled = true;
                          // arr.push(list.key);
                        }
                      });
                    }
                    if (list.value == itemss.userId) {
                      list.disabled = true;
                    }
                  });
                }
              });
            });
          }
        });
        if (this.$props.isShowConnectPeople.group) {
          this.$props.isShowConnectPeople.group.forEach(item => {
            this.datas.forEach(items => {
              if (items.children) {
                items.children.forEach(list => {
                  if (list.children) {
                    list.children.forEach(third => {
                      // disi
                      if (third.children) {
                        third.children.forEach(forth => {
                          if (forth.value == item.userId) {
                            forth.disabled = true;
                            arr.push(forth.key);
                          }
                        });
                      }
                      if (third.value == item.userId) {
                        third.disabled = true;
                        arr.push(third.key);
                      }
                    });
                  }
                  if (list.value == item.userId) {
                    list.disabled = true;
                    arr.push(list.key);
                  }
                });
              }
            });
          });
        }
        this.$refs.tree.setCheckedKeys(arr);
        this.choosedPeople = this.$refs.tree.getCheckedNodes(true, true);
        this.choosedPeople = this.uniqueobj(this.choosedPeople);
      } else if (this.$props.isShowConnectPeople.type == "验收") {
        let arr = [];
        // console.log(this.isShowConnectPeople)
        this.$props.isShowConnectPeople.Allgroup.forEach(item => {
          if (item.members) {
            item.members.forEach(itemss => {
              this.datas.forEach(items => {
                if (items.children) {
                  items.children.forEach(list => {
                    if (list.children) {
                      list.children.forEach(third => {
                        if (third.value == itemss.userId) {
                          third.disabled = true;
                          // arr.push(list.key);
                        }
                      });
                    }
                    if (list.value == itemss.userId) {
                      list.disabled = true;
                    }
                  });
                }
              });
            });
          }
        });
        if (this.$props.isShowConnectPeople.group) {
          this.$props.isShowConnectPeople.group.forEach(item => {
            this.datas.forEach(items => {
              if (items.children) {
                items.children.forEach(list => {
                  if (list.children) {
                    list.children.forEach(third => {
                      // disi
                      if (third.children) {
                        third.children.forEach(forth => {
                          if (forth.value == item.userId) {
                            forth.disabled = true;
                            arr.push(forth.key);
                          }
                        });
                      }
                      if (third.value == item.userId) {
                        third.disabled = true;
                        arr.push(third.key);
                      }
                    });
                  }
                  if (list.value == item.userId) {
                    list.disabled = true;
                    arr.push(list.key);
                  }
                });
              }
            });
          });
        }
        this.$refs.tree.setCheckedKeys(arr);
        this.choosedPeople = this.$refs.tree.getCheckedNodes(true, true);
        this.choosedPeople = this.uniqueobj(this.choosedPeople);
      } else if (this.$props.isShowConnectPeople.type == "协同") {
        let arr = [];
        // console.log(this.isShowConnectPeople)
        this.$props.isShowConnectPeople.Allgroup.forEach(item => {
          if (item.members) {
            item.members.forEach(itemss => {
              this.datas.forEach(items => {
                if (items.children) {
                  items.children.forEach(list => {
                    if (list.children) {
                      list.children.forEach(third => {
                        if (third.value == itemss.userId) {
                          third.disabled = true;
                          // arr.push(list.key);
                        }
                      });
                    }
                    if (list.value == itemss.userId) {
                      list.disabled = true;
                    }
                  });
                }
              });
            });
          }
        });
        if (this.$props.isShowConnectPeople.group) {
          this.$props.isShowConnectPeople.group.forEach(item => {
            this.datas.forEach(items => {
              if (items.children) {
                items.children.forEach(list => {
                  if (list.children) {
                    list.children.forEach(third => {
                      // disi
                      if (third.children) {
                        third.children.forEach(forth => {
                          if (forth.value == item.userId) {
                            forth.disabled = true;
                            arr.push(forth.key);
                          }
                        });
                      }
                      if (third.value == item.userId) {
                        third.disabled = true;
                        arr.push(third.key);
                      }
                    });
                  }
                  if (list.value == item.userId) {
                    list.disabled = true;
                    arr.push(list.key);
                  }
                });
              }
            });
          });
        }
        this.$refs.tree.setCheckedKeys(arr);
        this.choosedPeople = this.$refs.tree.getCheckedNodes(true, true);
        this.choosedPeople = this.uniqueobj(this.choosedPeople);
      }
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    uniqueobj(arr) {
      let obj = {};
      let peon = arr.reduce((cur, next) => {
        obj[next.value] ? "" : (obj[next.value] = true && cur.push(next));
        return cur;
      }, []);
      return peon;
    },
    handleClose(done) {
      let newArr = [];
      this.$refs.tree.getCheckedNodes(true, true).forEach(item => {
        if (item.key != done) {
          newArr.push(item);
        }
        if (item.key == done) {
          // console.log(item);
        }
      });
      this.$refs.tree.setCheckedNodes(newArr);
      this.choosedPeople = this.uniqueobj(newArr);
    },
    test(data, ob) {
      this.choosedPeople = this.$refs.tree.getCheckedNodes(true, true);
      this.choosedPeople = this.uniqueobj(this.choosedPeople);
    },
    test1(data, ischecked) {
      let Arr = this.$refs.tree.getCheckedNodes(true, true);
      let newArr = [];
      if (ischecked) {
        this.datas.forEach;
        this.$refs.tree.getCheckedNodes(true, true).forEach(item => {
          if (data.value == item.value) {
            newArr.push(item);
          }
        });
      }
      if (!ischecked) {
        this.$refs.tree.getCheckedNodes(true, true).forEach((item, index) => {
          if (item.value == data.value) {
            Arr.splice(index, 1);
          }
        });
      }
      this.$refs.tree.setCheckedNodes(Arr);
      this.choosedPeople = this.uniqueobj(
        this.$refs.tree.getCheckedNodes(true, true)
      );
    },
    chooseOk() {
      if (this.$props.isShowConnectPeople.type == "审批") {
        if (this.choosedPeople.length > 0) {
          this.choosedPeople.forEach(item => {
            this.giveTofather.members.push({
              userId: item.value,
              userName: item.label,
              operateStatus: "0",
              businessType: this.$props.businessType,
              operateType: "0",
              operateLevel: this.$props.isShowConnectPeople.index
            });
          });
        }
        this.giveTofather.indexs = this.$props.isShowConnectPeople.index;
        this.$emit("listenValue", this.giveTofather);
      } else if (this.$props.isShowConnectPeople.type == "抄送") {
        if (this.choosedPeople.length > 0) {
          this.choosedPeople.forEach(item => {
            this.giveTofatherCopyList.copierList.push({
              userId: item.value,
              userName: item.label,
              operateStatus: "0",
              businessType: this.$props.businessType,
              operateType: "2"
            });
          });
        }
        this.$emit("listenValueCopy", this.giveTofatherCopyList);
      } else if (this.$props.isShowConnectPeople.type == "验收") {
        if (this.choosedPeople.length > 0) {
          this.choosedPeople.forEach(item => {
            this.giveTofatherCheckedList.checkedList.push({
              userId: item.value,
              userName: item.label,
              operateStatus: "0",
              businessType: this.$props.businessType,
              operateType: "7"
            });
          });
        }
        this.$emit("listenValueCheck", this.giveTofatherCheckedList);
      } else if (this.$props.isShowConnectPeople.type == "协同") {
        if (this.choosedPeople.length > 0) {
          this.choosedPeople.forEach(item => {
            this.giveTofatherCoopList.coopList.push({
              userId: item.value,
              userName: item.label,
              operateStatus: "0",
              businessType: this.$props.businessType,
              operateType: "7"
            });
          });
        }
        this.$emit("listenValueCoop", this.giveTofatherCoopList);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang='scss' scoped>
.all {
  display: flex;
  height: 540px;

  /deep/ .el-tree {
    width: 50%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    //滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }
  }
  .hasChoosedPeople {
    padding-left: 15px;
    width: 50%;
    border-left: 1px solid #ccc;
  }
}
.hasChoosedPeople {
  height: 100%;
  position: relative;
  // display: flex;
  // flex-wrap: wrap;
  .isTitle {
    width: 100%;
  }
  /deep/ .el-tag {
    margin-right: 10px;
    margin-top: 10px;
  }
}
.btnWarp {
  position: absolute;
  bottom: 10px;
  right: 5px;
}
</style>