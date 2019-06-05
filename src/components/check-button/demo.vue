<template>
  <div>
    <div>
      <check-button a="1" b="2" :checked="false">
        这是个button with checked
      </check-button>
      <check-button a="1" b="2">
        这是个button
      </check-button>
    </div>
    <div>
      <group :options="['a', 'b', 'c']" class="black">这是button group</group>
      <group :options="[]" class="black">这是button group</group>
      <group :options="[]" class="black">
        <check-button a="1" b="2" :checked="false">
          这是个button group
        </check-button>
      </group>
    </div>
  </div>
</template>

<script>
import CheckButton from "./check-button";
import Group from "./group";
export default {
  name: "check-button-demo",
  components: {
    CheckButton,
    Group
  }
};
</script>
