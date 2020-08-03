export default {
  bind(el, binding, vnode) {
    console.log(binding);
    let dom = el.value ? el : el.children[0];
    dom.handler = () =>{
      dom.value = dom.value.replace(/\D+/g, '')
      if(binding.value && binding.value.max && dom.value > parseInt(binding.value.max)){
        dom.value = parseInt(binding.value.max);
      }
      console.log(dom.value);
      vnode['context'][binding.value.keys[0]][binding.value.keys[1]] = dom.value;
    }
    dom.addEventListener('input', dom.handler)
  },
}
