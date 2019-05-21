function levenshteinDistance(a, b) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}


Vue.component('color', {
  props: {
    color: String
  },
  computed: {
    colorName: function() {
      switch (this.color) {
        case "R":
          return "Red";
        case "Y":
          return "Yellow";
          l
        case "B":
          return "Blue";
        case "W":
          return "White";
        case "K":
          return "Black";
        case "G":
          return "Green";
      }
      return "ERROR";
    }
  },
  template: `<span :class="'color color-' + color"><slot>{{ colorName }}</slot></span>`
});

class SubjectWire {
  constructor(gstate) {
    this.gstate = gstate;
  }
  calc(wires) {
    switch (wires.length) {
      // Cases are checked in reversed order 
      case 3:
        if (wires.filter(w => w == 'R').length == 0)
          return 2;
        if (wires[2] == 'W')
          return 3;
        if (wires.filter(w => w == 'B').length > 1)
          return wires.lastIndexOf("B") + 1;
        return 3;
      case 4:
        if (!this.gstate.even && wires.filter(w => w == 'R').length > 1)
          return wires.lastIndexOF("R") + 1;
        if (wires[3] == 'Y' && wires.filter(w => w == 'R').length == 0)
          return 1;
        if (wires.filter(w => w == 'B').length == 1)
          return 1;
        if (wires.filter(w => w == 'Y').length > 1)
          return 4;
        return 2;
      case 5:
        if (!this.gstate.even && wires[4] == 'K')
          return 4;
        if (wires.filter(w => w == 'R').length == 1 && wires.filter(w => w == 'Y').length > 1)
          return 1;
        if (wires.filter(w => w == 'K').length == 0)
          return 2;
        return 1;
      case 6:
        if (!this.gstate.even && wires.filter(w => w == 'Y').length == 0)
          return 3;
        if (wires.filter(w => w == 'Y').length == 1 && wires.filter(w => w == 'W').length > 1)
          return 4;
        if (wires.filter(w => w == 'R').length == 0)
          return 6;
        return 4;
    }
    return -1;
  }
  process(cmd) {
    if (!/^[RWYKB]{3,6}$/.test(cmd))
      return false;
    var wires = cmd.split('');

    var ans = this.calc(wires)

    var t = Vue.extend({
      props: ['wires', 'answer'],
      template: `
        <div>
          <h1>Wire</h1>
          <p><color v-for="w in wires" :color="w" /> <span class="action">Cut the #{{ answer }} wire</span></p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        wires: wires,
        answer: ans
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectButton {
  constructor(gstate) {
    this.gstate = gstate;
  }
  calc(color, text) {
    if (color == 'B' && text == 'A')
      return false;
    if (this.gstate.battery > 1 && text == 'D')
      return true;
    if (this.gstate.hasCar && color == 'W')
      return false;
    if (this.gstate.battery > 2 && this.gstate.hasFrk)
      return true;
    if (color == 'Y')
      return false;
    if (color == 'R' && text == 'H')
      return true;
    return false;
  }
  process(cmd) {
    var re = /^([RYBW])\s+([A-Z])$/;
    var m = re.exec(cmd)
    if (m === null)
      return false;
    var isClick = this.calc(m[1], m[2]);

    var t = Vue.extend({
      props: ['color', 'text', 'isClick'],
      template: `
        <div>
          <h1>Button</h1>
          <p><color :color="color" /> - {{ text }}
          <p v-if="isClick" class="action">Click and release</p>
          <p v-if="!isClick" class="action">Hold: <color color="B">Blue → 4</color>, or <color color="Y">Yellow → 5</color>, or 1</p>
          </p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        color: m[1],
        text: m[2],
        isClick: isClick
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectKeypad {
	constructor(gstate) {
  	this.gstate = gstate;
  }
  static answers() {
  	return [
      "o a l n x h C".toUpperCase().split(/\s+/),
      "E o C q s h ?".toUpperCase().split(/\s+/),
      "c w q k 3 l s".toUpperCase().split(/\s+/),
      "6 n t x k ? )".toUpperCase().split(/\s+/),
      "y ) t C n 3 s".toUpperCase().split(/\s+/),
      "6 E p a y n o".toUpperCase().split(/\s+/)
    ]
  }
  calc(input) {
  	var answers = SubjectKeypad.answers();
    var ans = answers.filter(group => 
      input.filter(i => group.indexOf(i) >= 0).length == 4
    );    
    if (ans.length == 1) {
      var group = answers.findIndex(group => 
        input.filter(i => group.indexOf(i) >= 0).length == 4
      );
      var text = ans[0].filter(i => input.indexOf(i) >= 0);
    	return [group, text.map(c => ans[0].indexOf(c)), text ];
    }
    return null;
  }
  process(cmd) {
  	var t, out;  	
    var ans = null;
    if (cmd != 'KP' && cmd != 'K') {
      if (!/^\S\s+\S\s+\S\s+\S$/.test(cmd))
        return false;
      ans = this.calc(cmd.split(/\s+/));
    }
    if (ans == null) {
      var t = Vue.extend({
        props: ['answers'],
        template: `
<div>
<h1>Keypads</h1>
<p style="position: relative; overflow: auto">
<img class="keypad">
<span v-for="(g, x) in answers">
<pre v-for="(c, y) in g" :style="'font-size: 150%; position: absolute; left: '+(x*146.5)+'px; top:'+(y*92.5)+'px;'">{{ c }}</pre>
</span>
</p>
<p class="action">Enter four characters like <pre>C H X N</pre> to get the proper order</p>
</div>
`
      });
      var out = new t({propsData: { answers: SubjectKeypad.answers() }});
    } else {
      var t = Vue.extend({
      	props: ['group', 'cells', 'answer'],
        template: `
          <div>
            <h1>Keypads</h1>
            <p>
            	<span v-for="(c, i) in cells" style="position: relative; display: inline-block; overflow: auto">
            		<img class="keypad" :style="'background-position: '+(group*-146.5)+'px '+(c*-92.5)+'px; height: 95px; width: 95px;'">
                <pre style="position: absolute; font-size: 150%; left: 0; top: 0">{{ answer[i] }}</pre>
              </span>
            </p>
          </div>
        `
      });
      var out = new t({propsData: { group: ans[0], cells: ans[1], answer: ans[2] }});
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectSimon {
  constructor(gstate) {
    this.gstate = gstate;
    this.last = null;
  }
  calc(input) {
    var map = { R: "R", B: "B", G: "G", Y: "Y" };
    if (this.gstate.vowel) {
      if (this.gstate.strike <= 0)
        map = { R: "B", B: "R", G: "Y", Y: "G" };
      if (this.gstate.strike == 1)
        map = { R: "Y", B: "G", G: "B", Y: "R" };
      if (this.gstate.strike >= 2)
        map = { R: "G", B: "R", G: "Y", Y: "B" };
    } else {
      if (this.gstate.strike <= 0)
        map = { R: "B", B: "Y", G: "G", Y: "R" };
      if (this.gstate.strike == 1)
        map = { R: "R", B: "B", G: "Y", Y: "G" };
      if (this.gstate.strike >= 2)
        map = { R: "Y", B: "G", G: "B", Y: "R" };
    }
    return input.map(c => map[c]);
  }
  process(cmd) {
    var ans;
    if (cmd == 'S' || cmd == 'SS') {
      this.last = [];
    } else {
      var re = /^S*([RBGY])$/;
      var m = re.exec(cmd);
      if (!m)
        return false;
      if (this.last === null)
        this.last = [];

      this.last.push(m[1]);
      ans = this.calc(this.last);
    }

    var t = Vue.extend({
      props: ['input', 'answer'],
      template: `
        <div>
          <h1>Simon Says (S to reset)</h1>
          <p v-if="input.length == 0">Now type <pre>R</pre>, <pre>B</pre>, <pre>G</pre>, <pre>Y</pre> for each new color</p>
          <p v-if="input.length > 0">Simon: <color v-for="c in input" :color="c" /></p>
          <p v-if="input.length > 0" class="action">Say: <color v-for="c in answer" :color="c" /></p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        input: this.last.slice(0),
        answer: ans
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectWhoOnFirst {
  constructor(gstate) {
    this.gstate = gstate;
    this.phase = 1;
  }
  calcPhase1(text) {
    var pos = null;
    var n = text;
    switch (text.replace(/[ ']/g, "")) {
      case "YES": pos = "LM"; break;
      case "FIRST": pos = "RT"; break;
      case "DISPLAY": pos = "RB"; break;
      case "OKAY": pos = "RT"; break;
      case "SAYS": pos = "RB"; break;
      case "NOTHING": pos = "LM"; break;
      case "-": pos = "LB"; break;
      case "BLANK": pos = "RM"; break;
      case "NO": pos = "RB"; break;
      case "LED": pos = "LM"; break;
      case "LEAD": pos = "RB"; break;
      case "READ": pos = "RM"; break;
      case "RED": pos = "RM"; break;
      case "REED": pos = "LB"; break;
      case "LEED": pos = "LB"; break;
      case "HOLDON": n = "HOLD ON"; pos = "RB"; break;
      case "YOU": pos = "RM"; break;
      case "YOUARE": n = "YOU ARE"; pos = "RB"; break;
      case "YOUR": pos = "RM"; break;
      case "YOURE": n = "YOU'RE"; pos = "RM"; break;
      case "UR": pos = "LT"; break;
      case "THERE": pos = "RB"; break;
      case "THEYRE": n = "THEY'RE"; pos = "LB"; break;
      case "THEIR": pos = "RM"; break;
      case "THEYARE": n = "THEY ARE"; pos = "LM"; break;
      case "SEE": pos = "RB"; break;
      case "C": pos = "RT"; break;
      case "CEE": pos = "RB"; break;
    }
    var text = "";
    switch (pos) {
    case "LT": text = "↖️ Left Top"; break;
    case "LM": text = "⬅️ Left Middle"; break;
    case "LB": text = "↙️ Left Bottom"; break;
    case "RT": text = "↗️ Right Top"; break;
    case "RM": text = "➡️ Right Middle"; break;
    case "RB": text = "↘️ Right Bottom"; break;
    }
    return [pos != null ? text : null, n];
  }
  calcPhase2(text) {
    var ans = null;
    var n = text;
    switch (text.replace(/[ ']/g, "")) {
      case "READY":
        ans = "YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY, NO, FIRST, UHHH, NOTHING, WAIT";
        break;
      case "FIRST":
        ans = "LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST";
        break;
      case "NO":
        ans = "BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO, MIDDLE";
        break;
      case "BLANK":
        ans = "WAIT, RIGHT, OKAY, MIDDLE, BLANK, PRESS, READY, NOTHING, NO, WHAT, LEFT, UHHH, YES, FIRST";
        break;
      case "NOTHING":
        ans = "UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING, READY";
        break;
      case "YES":
        ans = "OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES, LEFT, BLANK, NO, WAIT";
        break;
      case "WHAT":
        ans = "UHHH, WHAT, LEFT, NOTHING, READY, BLANK, MIDDLE, NO, OKAY, FIRST, WAIT, YES, PRESS, RIGHT";
        break;
      case "UHHH":
        ans = "READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH, MIDDLE, WAIT, FIRST";
        break;
      case "LEFT":
        ans = "RIGHT, LEFT, FIRST, NO, MIDDLE, YES, BLANK, WHAT, UHHH, WAIT, PRESS, READY, OKAY, NOTHING";
        break;
      case "RIGHT":
        ans = "YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT, MIDDLE, LEFT, UHHH, BLANK, OKAY, FIRST";
        break;
      case "MIDDLE":
        ans = "BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE, RIGHT, FIRST, UHHH, YES";
        break;
      case "OKAY":
        ans = "MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY, LEFT, READY, BLANK, PRESS, WHAT, RIGHT";
        break;
      case "WAIT":
        ans = "UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT, NOTHING, READY, RIGHT, MIDDLE";
        break;
      case "PRESS":
        ans = "RIGHT, MIDDLE, YES, READY, PRESS, OKAY, NOTHING, UHHH, BLANK, LEFT, FIRST, WHAT, NO, WAIT";
        break;
      case "YOU":
        ans = "SURE, YOU ARE, YOUR, YOU'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU, UH UH, LIKE, DONE, U";
        break;
      case "YOUARE":
        n = "YOU ARE";
        ans = "YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU'RE, SURE, UR, YOU ARE";
        break;
      case "YOUR":
        ans = "UH UH, YOU ARE, UH HUH, YOUR, NEXT, UR, SURE, U, YOU'RE, YOU, WHAT?, HOLD, LIKE, DONE";
        break;
      case "YOURE":
        n = "YOU'RE";
        ans = "YOU, YOU'RE, UR, NEXT, UH UH, YOU ARE, U, YOUR, WHAT?, UH HUH, SURE, DONE, LIKE, HOLD";
        break;
      case "UR":
        ans = "DONE, U, UR, UH HUH, WHAT?, SURE, YOUR, HOLD, YOU'RE, LIKE, NEXT, UH UH, YOU ARE, YOU";
        break;
      case "U":
        ans = "UH HUH, SURE, NEXT, WHAT?, YOU'RE, UR, UH UH, DONE, U, YOU, LIKE, HOLD, YOU ARE, YOUR";
        break;
      case "UHHUH":
        n = "UH HUH";
        ans = "UH HUH, YOUR, YOU ARE, YOU, DONE, HOLD, UH UH, NEXT, SURE, LIKE, YOU'RE, UR, U, WHAT?";
        break;
      case "UHUH":
        n = "UH UH";
        ans = "UR, U, YOU ARE, YOU'RE, NEXT, UH UH, DONE, YOU, UH HUH, LIKE, YOUR, SURE, HOLD, WHAT?";
        break;
      case "WHAT?":
        ans = "YOU, HOLD, YOU'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?, SURE";
        break;
      case "DONE":
        ans = "SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE";
        break;
      case "NEXT":
        ans = "WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT, LIKE, DONE, YOU ARE, UR, YOU'RE, U, YOU";
        break;
      case "HOLD":
        ans = "YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU'RE, NEXT, HOLD, UH HUH, YOUR, LIKE";
        break;
      case "SURE":
        ans = "YOU ARE, DONE, LIKE, YOU'RE, YOU, HOLD, UH HUH, UR, SURE, U, WHAT?, NEXT, YOUR, UH UH";
        break;
      case "LIKE":
        ans = "YOU'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE, SURE, YOU ARE, YOUR";
        break;
    }
    return [ans, n];
  }
  process(cmd) {
    var pos, ans, normalized;
    if (cmd == "WHO") {
      this.phase = 1;
    } else {
      if (this.phase == 1) {
        [pos, normalized] = this.calcPhase1(cmd);
        if (pos != null) {
          this.phase = 2;
        } else {
          [ans, normalized] = this.calcPhase2(cmd);
          if (ans === null) return false;
        }
      } else {
        [ans, normalized] = this.calcPhase2(cmd);
        if (ans != null) {
          this.phase = 1;
        } else {
          [pos, normalized] = this.calcPhase1(cmd);
          if (pos === null) return false;
        }
      }
    }
    if (ans != null) {  
      var anss = ans.split(/, */);
      if (anss.indexOf(normalized) >= 0) {
        anss.splice(anss.indexOf(normalized) + 1);
        ans = anss.join(', ');
      }
    }

    var out, t;
    if (pos != null) {
      t = Vue.extend({
        props: ['pos', 'normalized'],
        template: `
          <div>
            <h1>Who’s on First (Step 1)</h1>
            <p>Display: <pre>{{ normalized }}</pre> <span class="action">{{ pos }}</span></p>
          </div>
        `
      });
      out = new t({
        propsData: {
          pos: pos,
          normalized: normalized
        }
      });
    } else if (ans != null) {
      t = Vue.extend({
        props: ['answer', 'normalized'],
        template: `
          <div>
            <h1>Who’s on First (Step 2)</h1>
            <p>Button: <pre>{{ normalized }}</pre> <span class="action">{{ answer }}</span></p>
          </div>
        `
      });
      out = new t({
        propsData: {
          answer: ans,
          normalized: normalized
        }
      });
    } else {
      t = Vue.extend({
        template: `<div><h1>Who’s on First</h1><p>State is reset</p></div>`
      });
      out = new t({});
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectMorse {
  constructor(gstate) {
    this.gstate = gstate;
    this.last = "";
  }
  static morseToChar(morse) {
    switch (morse) {
      case '.-':
        return 'A';
      case '-...':
        return 'B';
      case '-.-.':
        return 'C';
      case '-..':
        return 'D';
      case '.':
        return 'E';
      case '..-.':
        return 'F';
      case '--.':
        return 'G';
      case '....':
        return 'H';
      case '..':
        return 'I';
      case '.---':
        return 'J';
      case '-.-':
        return 'K';
      case '.-..':
        return 'L';
      case '--':
        return 'M';
      case '-.':
        return 'N';
      case '---':
        return 'O';
      case '.--.':
        return 'P';
      case '--.-':
        return 'Q';
      case '.-.':
        return 'R';
      case '...':
        return 'S';
      case '-':
        return 'T';
      case '..-':
        return 'U';
      case '...-':
        return 'V';
      case '.--':
        return 'W';
      case '-..-':
        return 'X';
      case '-.--':
        return 'Y';
      case '--..':
        return 'Z';
    }
    return '_';
  }
  static answers() {
    return {
      'shell': '3.505 MHz',
      'halls': '3.515 MHz',
      'slick': '3.522 MHz',
      'trick': '3.532 MHz',
      'boxes': '3.535 MHz',
      'leaks': '3.542 MHz',
      'strobe': '3.545 MHz',
      'bistro': '3.552 MHz',
      'flick': '3.555 MHz',
      'bombs': '3.565 MHz',
      'break': '3.572 MHz',
      'brick': '3.575 MHz',
      'steak': '3.582 MHz',
      'sting': '3.592 MHz',
      'vector': '3.595 MHz',
      'beats': '3.600 MHz',
    };
  }
  calc(input) {
    var answers = SubjectMorse.answers();
    var distances = {};
    var keys = Object.keys(answers);
    keys.forEach(function(w) {
      var target = w.toUpperCase();
      var mind = 9999;
      for (let i = 0; i < target.length; i++) {        
        var d = levenshteinDistance(input, target) * 2 + (i == 0 ? 0 : 1);
        if (d < mind) {
          mind = d;
        }
        target = target.substr(1) + target[0];
      }
      distances[w] = mind;
    });    
    keys.sort((a, b) => distances[a] - distances[b]);
    return keys.map(k => { return {'key': k, 'distance': distances[k], 'answer': answers[k] }; });
  }
  process(cmd) {
    var out, t;
    var m, re;
    re = /^O\s+([A-Z]*)$/;
    m = re.exec(cmd);
    if (m) {
      this.last = m[1];
    } else {
      re = /^([.-]+\s+)*[.-]+$/;
      if (!re.test(cmd))
        return false;

      var prev = this.last;
      var cur = cmd.split(/ +/g).map(m => SubjectMorse.morseToChar(m)).join('');
      this.last = this.last + cur;
      if (this.last.length > 6)
        this.last = this.last.substr(this.last.length - 6);
      var prev = this.last.substr(0, this.last.length - cur.length);
    }

    if (this.last.length > 0)
    {
      var ans = this.calc(this.last);
      t = Vue.extend({
        props: ['cur', 'answer'],
        template: `
          <div>
            <h1>Morse (O to reset)</h1>
            <p><pre>{{cur}}</prev></p>
            <ul v-if="answer.length > 0">
              <li v-for="p in answer">{{ p.key }}: {{ p.distance }} ({{ p.answer }})</li>
            </ul>
          </div>
        `
      });
      out = new t({ propsData: { cur: this.last, answer: ans.filter(p => p.distance <= 4*2) } });
    } else {
        t = Vue.extend({
          template: `<div><h1>Morse</h1><p>State is reset</p></div>`
        });
        out = new t({});    
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectMemory {
  constructor(gstate) {
    this.gstate = gstate;
    this.last = [];
  }
  calc(input) {
    var ps = [0, 0, 0, 0, 0];
    if (input.length >= 1) {
      switch (input[0][0]) {
        case '1':
          ps[0] = 2;
          break;
        case '2':
          ps[0] = 2;
          break;
        case '3':
          ps[0] = 3;
          break;
        case '4':
          ps[0] = 4;
          break;
      }
    }
    if (input.length >= 2) {
      switch (input[1][0]) {
        case '1':
          ps[1] = input[1].slice(1).indexOf('4') + 1;
          break;
        case '2':
          ps[1] = ps[0];
          break;
        case '3':
          ps[1] = 1;
          break;
        case '4':
          ps[1] = ps[0];
          break;
      }
    }
    if (input.length >= 3) {
      switch (input[2][0]) {
        case '1':
          ps[2] = input[2].slice(1).indexOf(input[1][ps[1]]) + 1;
          break;
        case '2':
          ps[2] = input[2].slice(1).indexOf(input[0][ps[0]]) + 1;
          break;
        case '3':
          ps[2] = 3;
          break;
        case '4':
          ps[2] = input[2].slice(1).indexOf('4') + 1;
          break;
      }
    }
    if (input.length >= 4) {
      switch (input[3][0]) {
        case '1':
          ps[3] = ps[0];
          break;
        case '2':
          ps[3] = 1;
          break;
        case '3':
          ps[3] = ps[1];
          break;
        case '4':
          ps[3] = ps[1];
          break;
      }
    }
    if (input.length >= 5) {
      switch (input[4][0]) {
        case '1':
          ps[4] = input[4].slice(1).indexOf(input[0][ps[0]]) + 1;
          break;
        case '2':
          ps[4] = input[4].slice(1).indexOf(input[1][ps[1]]) + 1;
          break;
        case '3':
          ps[4] = input[4].slice(1).indexOf(input[3][ps[3]]) + 1;
          break;
        case '4':
          ps[4] = input[4].slice(1).indexOf(input[2][ps[2]]) + 1;
          break;
      }
    }
    return ps[input.length - 1];
  }
  process(cmd) {
    var ans, out, t;
    if (cmd == 'M') {
      t = Vue.extend({
        template: `<div><h1>Memory</h1><p>State is reset</p></div>`
      });
      out = new t({});
      this.last = [];
    } else {
      var re = /^([1-5])?([1-4]{5})$/;
      var m = re.exec(cmd);
      if (m === null)
        return false;
      var pos = m[1] != null ? m[1] : this.last.length + 1;
      var value = m[2];
      if (/([1234]).*\1/.test(value.substr(1))) {
        t = Vue.extend({
          props: ['step', 'display', 'buttons', 'answer'],
          template: `
            <div>
              <h1>Memory (Step {{step}})</h1>
              <p>Display: <pre>{{ display }}</pre>, Buttons: <pre v-for="b in buttons">{{ b }}</pre></p>
              <p class="action">Error! Check for duplicated buttons.</p>
            </div>
          `
        });
        out = new t({
          propsData: {
            step: pos,
            display: value.substr(0, 1),
            buttons: value.substr(1).split(''),
            answer: ans
          }
        });
      } else {        
        if (pos > 5) {
          this.last = [];
          pos = 1;
        }
        if (pos > this.last.length) pos = this.last.length + 1;
        this.last[pos - 1] = value.split('');
        this.last = this.last.slice(0, pos);
        ans = this.calc(this.last);

        t = Vue.extend({
          props: ['step', 'display', 'buttons', 'answer'],
          template: `
            <div>
              <h1>Memory (Step {{step}})</h1>
              <p>
              <span style="display: inline-block; border: 1px solid black; padding: 0.25em"><pre>{{ display }}</pre></span> →
              <span style="display: inline-block; border: 1px solid black; padding: 0.25em"><pre v-for="b in buttons">{{ b }}</pre></span> <span class="action">Press the #{{answer}} button</span></p>
            </div>
          `
        });
        out = new t({
          propsData: {
            step: pos,
            display: this.last[pos - 1][0],
            buttons: this.last[pos - 1].slice(1),
            answer: ans
          }
        });
      }
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}


class SubjectComplicatedWire {
  constructor(gstate) {
    this.gstate = gstate;
  }
  calc(led, star, red, blue) {
    if (!led && !star) {
      if (!red && !blue)
        return true;
      return this.gstate.even;
    }
    if (!led && star) {
      if (!red && !blue)
        return true;
      if (red && !blue)
        return true;
      if (!red && blue)
        return false;
      if (red && blue)
        return this.gstate.parallel;
    }
    if (led && !star) {
      if (!red && !blue)
        return false;
      if (red && !blue)
        return this.gstate.battery >= 2;
      if (!red && blue)
        return this.gstate.parallel
      if (red && blue)
        return this.gstate.even;
    }
    if (led && star) {
      if (!red && !blue)
        return this.gstate.battery >= 2;
      if (red && !blue)
        return this.gstate.battery >= 2;
      if (!red && blue)
        return this.gstate.parallel;
      if (red && blue)
        return false;
    }
    return false;
  }
  process(cmd) {
    var re = /^C*([RBWL]+S*L*)$/;
    var m = re.exec(cmd);
    if (!m)
      return false;

    var text = m[1];

    // Must have at least one color
    if (!/[RBW]/.test(text))
      return false;
    // 3 or more colors is Wire
    if (text.length - text.replace(/[RBW]/g, '').length >= 3)
      return false;

    var led = text.indexOf("L") >= 0;
    var star = text.indexOf("S") >= 0;
    var white = text.indexOf("W") >= 0;
    var red = text.indexOf("R") >= 0;
    var blue = text.indexOf("B") >= 0;
    var ans = this.calc(led, star, red, blue);

    var t = Vue.extend({
      props: ['led', 'star', 'white', 'red', 'blue', 'cut'],
      template: `
        <div>
          <h1>Complicated Wire</h1>
          <p><span v-if="led">💡</span><color v-if="white" color="W" /><color v-if="red" color="R" /><color v-if="blue" color="B" /><span v-if="star">⭐</span>
              <span v-if="cut" class="action">✂️ Cut</span>
              <span v-if="!cut" class="action">💚 Keep </span>
          </p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        led: led,
        star: star,
        white: white,
        red: red,
        blue: blue,
        cut: ans
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectWireSequence {
  constructor(gstate) {
    this.gstate = gstate;
    this.count = {
      'R': 0,
      'B': 0,
      'K': 0
    };
  }
  static cutList(color) {
    switch (color) {
      case 'R':
        return ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'];
      case 'B':
        return ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'];
      case 'K':
        return ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C'];
    }
  }
  calc(color, target, toValue) {
    if (toValue != null) {
      this.count[color] = toValue;
    } else {
      this.count[color]++;
    }
    var list = SubjectWireSequence.cutList(color);
    if (this.count[color] > list.length)
      return false;
    var cut = list[this.count[color] - 1].indexOf(target) >= 0;
    return cut;
  }
  process(cmd) {
    var out;
    if (cmd == 'Q') {
      this.count = {
        'R': 0,
        'B': 0,
        'K': 0
      };
      t = Vue.extend({
        template: `<div><h1>Wire Sequences</h1><p>State is reset</p></div>`
      });
      out = new t({});
    } else {
      var re = /^Q*(?:([RBK])([ABC])|([ABC])([RBK]))([0-9]*)?$/;
      var m = re.exec(cmd);
      if (!m)
        return false;
      var color = m[1] || m[4];
      var target = m[2] || m[3];
      var toValue = m[5] != null ? parseInt(m[5]) : null;
      var ans = this.calc(color, target, toValue);

      var t = Vue.extend({
        props: ['red', 'blue', 'black', 'cut'],
        template: `
          <div>
            <h1>Wire Sequences (Q to reset)</h1>
            <p><color color="R" /> {{red}} <color color="B" /> {{blue}} <color color="K" /> {{black}}
              <span v-if="cut" class="action">✂️ Cut</span>
              <span v-if="!cut" class="action">💚 Keep</span>
            </p>
          </div>
        `
      });
      var out = new t({
        propsData: {
          red: this.count['R'],
          blue: this.count['B'],
          black: this.count['K'],
          cut: ans
        }
      });
    }

    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectMaze {
  constructor(gstate) {
    this.gstate = gstate;
    this.mazeIndex = null;
  }
  static getMaze() {
    // Definition:
    //    0 for None, 1 for Bottom, 2 for Right, 3 for Both (Normal Cell)
    //    A for None, B for Bottom, C for Right, D for Both (Anchor Cell)
    return [
      '012011 C03110 21201A 211310 012030 020200',
      '103001 0303B0 203010 0D0320 222030 202000',
      '012200 322130 022020 222C2A 213220 000200',
      'A21110 220110 213030 C11110 011120 002020',
      '111100 011031 0213A0 211230 201130 200A00',
      '2021A0 222030 033201 120220 03D210 000200',
      '0B1200 203130 130301 020130 231120 0A0000',
      '201C00 013130 201120 21C111 221111 000000',
      '201100 22A320 013030 220310 C22021 020200'
    ]
  }
  static getMazeAnchor(mazeString) {
    var arr = mazeString.replace(/\s/g, '').split('');
    var ai1 = arr.findIndex((c) => /[ABCD]/.test(c));
    var ai2 = arr.slice(ai1 + 1).findIndex((c) => /[ABCD]/.test(c)) + ai1 + 1;
    if (ai1 < 0) ai1 = 0;
    if (ai2 < ai1 + 1) ai2 = 0;
    var a1 = [ai1 / 6 >> 0, ai1 % 6];
    var a2 = [ai2 / 6 >> 0, ai2 % 6];
    return [a1, a2]
  }
  static translateMaze(mazeString) {
    var arr = mazeString.replace(/\s/g, '')
      .replace(/A/g, '0').replace(/B/g, '1').replace(/C/g, '2').replace(/D/g, '3').split('');
    var result = [];
    for (let y = 0; y < 6; y++) {
      result[y] = [];
      for (let x = 0; x < 6; x++) {
        var cell = arr[y * 6 + x];
        // Top, Right, Bottom, Left, Tag, Backtrace
        result[y][x] = [true, cell != 2 && cell != 3, cell != 1 && cell != 3, true, null, null];
        // Build wall for boundary
        if (y == 0) result[y][x][0] = false;
        if (x == 5) result[y][x][1] = false;
        if (y == 5) result[y][x][2] = false;
        if (x == 0) result[y][x][3] = false;
        // Copy the previous cell
        if (x > 0) result[y][x][3] = result[y][x - 1][1];
        if (y > 0) result[y][x][0] = result[y - 1][x][2];
      }
    }
    return result;
  }
  static walkMaze(maze, next, finish) {
    // Recursion safe guard
    if (this.step++ > 50) return [];
    var out;
    if (next[0] == finish[0] && next[1] == finish[1])
      return [];
    var cell = maze[next[0]][next[1]];
    if (cell[5]) return null;

    cell[5] = true;
    if (cell[0] && (out = SubjectMaze.walkMaze(maze, [next[0] - 1, next[1]], finish)) != null)
      return [cell[5] = '⇧'].concat(out);
    if (cell[1] && (out = SubjectMaze.walkMaze(maze, [next[0], next[1] + 1], finish)) != null)
      return [cell[5] = '⇨'].concat(out);
    if (cell[2] && (out = SubjectMaze.walkMaze(maze, [next[0] + 1, next[1]], finish)) != null)
      return [cell[5] = '⇩'].concat(out);
    if (cell[3] && (out = SubjectMaze.walkMaze(maze, [next[0], next[1] - 1], finish)) != null)
      return [cell[5] = '⇦'].concat(out);
    cell[5] = null;
    return null;
  }
  process(cmd) {
    var reInit = /^([1-6])\s*([1-6])$/;
    var re = /^([1-6])\s*([1-6])\s*([1-6])\s*([1-6])$/;
    var mInit = reInit.exec(cmd);
    var m = re.exec(cmd);
    if (!((m && this.mazeIndex != null) || mInit)) return false;
    var t, out;

    if (mInit) {
      var ai = [parseInt(mInit[1]) - 1, parseInt(mInit[2]) - 1];
      var mazes = SubjectMaze.getMaze();
      var maze;
      for (let i = 0; i < mazes.length; i++) {
        let [a1, a2] = SubjectMaze.getMazeAnchor(mazes[i]);
        if (
          // Check against one anchor is enough
          a1[0] == ai[0] && a1[1] == ai[1] || a2[0] == ai[0] && a2[1] == ai[1]
        ) {
          maze = SubjectMaze.translateMaze(mazes[i]);
          maze[a1[0]][a1[1]][4] = 'A';
          maze[a2[0]][a2[1]][4] = 'A';
          this.mazeIndex = i;
          break;
        }
      }

      if (maze) {
        t = Vue.extend({
          props: ['maze'],
          template: `<div><h1>Mazes (Selection)</h1>
            <div class="maze">
              <div v-for="r in maze" class="maze-row">
                <div v-for="c in r" :class="'maze-cell ' + (c[1] ? '' : 'maze-wall-r ') + (c[2] ? '' : 'maze-wall-b ') + (c[4] == 'A' ? 'maze-cell-anchor ' : '') + (c[4] == 'S' ? 'maze-cell-start ' : '') +  + (c[4] == 'F' ? 'maze-cell-finish ' : '')"></div>
              </div>
            </div>
            <p class="action">Ask for start and finish point, enter as <pre>S_Row S_Col F_Row F_Col</pre></p>
          </div>`
        });
        out = new t({
          propsData: {
            maze: maze
          }
        });
      } else {
        t = Vue.extend({
          template: `<div><h1>Mazes (Selection)</h1><p>Mazes not found</p></div>`
        });
        out = new t({});
      }
    } else {
      // Solve
      var start = [parseInt(m[1]) - 1, parseInt(m[2]) - 1];
      var finish = [parseInt(m[3]) - 1, parseInt(m[4]) - 1];
      var maze = SubjectMaze.translateMaze(SubjectMaze.getMaze()[this.mazeIndex]);
      maze[start[0]][start[1]][4] = 'S';
      maze[finish[0]][finish[1]][4] = 'F';
      this.step = 0;
      var ans = SubjectMaze.walkMaze(maze, start, finish);

      var anss = [];
      while (ans.length > 0) {
        anss.push(ans.splice(0, 6).join(' '));
      }

      t = Vue.extend({
        props: ['maze', 'answer'],
        template: `<div><h1>Mazes (Solution)</h1>
<div class="maze">
<div v-for="r in maze" class="maze-row">
<div v-for="c in r" :class="'maze-cell ' + (c[1] ? '' : 'maze-wall-r ') + (c[2] ? '' : 'maze-wall-b ') + (c[4] == 'A' ? 'maze-cell-anchor ' : '') + (c[4] == 'S' ? 'maze-cell-start ' : '') + (c[4] == 'F' ? 'maze-cell-finish ' : '')">{{ c[5] }}</div>
</div>
</div>
<p class="action">Go: {{ answer }}</p>
</div>`
      });
      out = new t({ propsData: { maze: maze, answer: anss.join(' / ') } });
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectPassword {
  constructor(gstate) {
    this.gstate = gstate;
    this.last = [['*'],['*'],['*'],['*'],['*']];
  }
  static words() {
    return `
      about  after  again  below  could 
      every  first  found  great  house
      large  learn  never  other  place
      plant  point  right  small  sound
      spell  still  study  their  there
      these  thing  think  three  water
      where  which  world  would  write`.toUpperCase().trim().split(/\s+/);
  }
  calc(input) {
    var ok = SubjectPassword.words().filter((w) => {
      var v = (input[0].indexOf('*')>=0 || input[0].indexOf(w[0]) >= 0) &&
        (input[1].indexOf('*')>=0 || input[1].indexOf(w[1]) >= 0) &&
        (input[2].indexOf('*')>=0 || input[2].indexOf(w[2]) >= 0) &&
        (input[3].indexOf('*')>=0 || input[3].indexOf(w[3]) >= 0) &&
        (input[4].indexOf('*')>=0 || input[4].indexOf(w[4]) >= 0);
      return v;
    })
    return ok;
  }
  process(cmd) {
    var ans, out, t;
    if (cmd == 'P') {
      t = Vue.extend({
        template: `<div><h1>Password</h1><p>State is reset</p></div>`
      });
      out = new t({});
      this.last = [['*'],['*'],['*'],['*'],['*']];
    } else {
      var re = /^(?:([1-5])([A-Z]+)|([1-5])([*])|([A-Z]{6,}))$/;
      var m = re.exec(cmd);
      if (m === null)
        return false;
      var pos = m[1] || m[3];
      var text = m[2] || m[4] || m[5];
      if (pos == null) pos = this.last.findIndex(c => c.length == 1 && c[0] == '*')+1;
      if (pos <= 0) pos = 1;
      if (pos > 5) {
        this.last = [['*'],['*'],['*'],['*'],['*']];
        pos = 1;
      }
      this.last[pos - 1] = text.split('').filter((v,i,s) => s.indexOf(v) === i);
      this.last[pos - 1].sort();
      ans = this.calc(this.last);

      t = Vue.extend({
        props: ['step', 'input', 'answer'],
        template: `
          <div>
            <h1>Password (Step {{step}})</h1>
            <p>Input: <pre v-for="i in input">{{ i }}</pre></p>
            <p v-if="answer.length >= 1" class="action">{{ answer.join(', ') }}</p>
            <p v-if="answer.length == 0" class="action">No answer. <pre>P</pre> to reset, <pre>{{step}}ABCD</pre> to reassign just this position</p>
          </div>
        `
      });
      out = new t({
        propsData: {
          step: pos,
          input: this.last.map(w => w.join('')),
          answer: ans
        }
      });
    }
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectKnob {
  constructor(gstate) {
    this.gstate = gstate;
  }
  calc(cmd) {
    // Read the top or bottom half with more zeros (light off)
    // Add some more cases where there are no disambiguation
    switch (cmd) {
      case '001011111101':
      case '101010011011':
      case '001011':
      case '101010':
        return 'Up';
      case '011001111101':
      case '101010010001':
      case '011001':
      case '010001':
        return 'Down';
      case '000010100111':
      case '000010000110':
      case '000010':
      case '000110':
      case '100111':
        return 'Left';
      case '101111111010':
      case '101100111010':
      case '111010':
      case '101100':
      case '101111':
        return 'Right';
    }
    return null;
  }
  process(cmd) {
    if (!/^[01]{12}|[01]{6}$/.test(cmd))
      return false;

    var ans = this.calc(cmd);
    var t = Vue.extend({
      props: ['answer'],
      template: `
        <div>
          <h1>Knob</h1>
          <p v-if="answer" class="action">Turn to <pre>{{ answer }}</pre></p>
          <p v-if="!answer" class="action">Error. Check the input.</p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        answer: ans
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

class SubjectSettings {
  constructor(gstate) {
    this.gstate = gstate;
  }
  process(cmd) {
    var re = /^\\([\\EVP01234CFO]*)$/;
    var m = re.exec(cmd);
    if (!m)
      return false;
    var opts = m[1];
    var vowel = opts.indexOf('V') >= 0;
    var even = opts.indexOf('E') >= 0;
    var parallel = opts.indexOf('P') >= 0;
    var battery0 = opts.indexOf('0') >= 0;
    var battery1 = opts.indexOf('1') >= 0;
    var battery2 = opts.indexOf('2') >= 0;
    var battery3 = opts.indexOf('3') >= 0;
    var labelCar = opts.indexOf('C') >= 0;
    var labelFrk = opts.indexOf('F') >= 0;
    var labelOther = opts.indexOf('O') >= 0;
    var addStrike = opts.indexOf('\\') >= 0;

    if (vowel) this.gstate.vowel = !this.gstate.vowel;
    if (even) this.gstate.even = !this.gstate.even;
    if (parallel) this.gstate.parallel = !this.gstate.parallel;
    if (battery0) this.gstate.battery = 0;
    if (battery1) this.gstate.battery = 1;
    if (battery2) this.gstate.battery = 2;
    if (battery3) this.gstate.battery = 3;
    if (labelCar) this.gstate.hasCar = !this.gstate.hasCar;
    if (labelFrk) this.gstate.hasFrk = !this.gstate.hasFrk;
    if (labelOther) this.gstate.label = 'NO_LABEL';
    if (addStrike) this.gstate.strike++;
    if (this.gstate.strike > 2) this.gstate.strike = 2;

    var t = Vue.extend({
      props: ['even', 'vowel', 'parallel', 'battery', 'hasCar', 'hasFrk', 'add_strike', 'strike'],
      template: `
        <div>
          <h1>Settings</h1>
          <p>
            <pre v-if="vowel">Vowel</pre>
            <pre v-if="even">Even</pre>
            <pre v-if="!even">Odd</pre>
            <pre v-if="parallel">Parallel</pre>
            <pre>Battery {{ battery }}</pre>
            <pre v-if="hasCar">CAR</pre>
            <pre v-if="hasFrk">FRK</pre>
            <span v-if="add_strike">Strike: {{ strike }}</span>
          </p>
        </div>
      `
    });
    var out = new t({
      propsData: {
        even: this.gstate.even,
        vowel: this.gstate.vowel,
        parallel: this.gstate.parallel,
        battery: this.gstate.battery,
        hasCar: this.gstate.hasCar,
        hasFrk: this.gstate.hasFrk,
        add_strike: addStrike,
        strike: this.gstate.strike
      }
    });
    out.$mount();
    this.gstate.container.appendChild(out.$el);
    return true;
  }
}

const templateCmd = Vue.extend({
  data: function() {
    return {
      cmd: "",
      executed: false
    };
  },
  template: `<input class="cmd" v-model="cmd" type="text" :disabled="executed" v-on:keyup.enter="submit">`,
  mounted: function() {
    var el = this.$el;
    setTimeout(function() {
      el.focus();
    }, 0);
  },
  methods: {
    submit: function() {
      if (this.cmd.trim().length == 0)
        return;
      this.executed = true;
      this.$emit('submitCommand', this.cmd);
    }
  }
});

var vm = new Vue({
  el: '#wrapper',
  data: {
    gstate: {},
    subjects: [],
  },
  mounted: function() {
    this.init();
    this.insertCmd();
  },
  methods: {
    insertCmd: function() {
      var out = new templateCmd();
      var that = this;
      out.$mount();
      out.$on('submitCommand', function(cmd) {
        that.submit(cmd);
      });
      this.gstate.container.appendChild(out.$el);
    },
    init: function() {
      var gstate = this.gstate = {
        container: this.$el.querySelector("#result"),

        // Bomb Description
        even: false,
        vowel: false,
        parallel: false,
        hasCar: false,
        hasFrk: false,
        battery: 0,
        strike: 0
      };
      this.subjects = [
        new SubjectWire(gstate),
        new SubjectButton(gstate),
        new SubjectKeypad(gstate),
        new SubjectSimon(gstate),
        new SubjectWhoOnFirst(gstate),
        new SubjectMemory(gstate),
        new SubjectMorse(gstate),
        new SubjectComplicatedWire(gstate),
        new SubjectWireSequence(gstate),
        new SubjectMaze(gstate),
        new SubjectPassword(gstate),
        new SubjectKnob(gstate),
        new SubjectSettings(gstate)
      ]

      var t = Vue.extend({
        props: ['data'],
        template: `
          <div>
            <h1><a href="http://bombmanual.com">Bomb Manual</a> Helper (Code: 241) (? for Help)</h1>
            <p><address><a href="https://github.com/it9gamelog/bomb-manual-helper">https://github.com/it9gamelog/bomb-manual-helper</a></address></p>
            <p>
              <label>S/N has Vowel? <pre>V</pre><input type="checkbox" v-model="data.vowel"></label><br>
              <label>S/N ends with Even number? <pre>E</pre><input type="checkbox" v-model="data.even"></label><br>
              <label>Parallel? <pre>P</pre><input type="checkbox" v-model="data.parallel"></label><br>
              Battery: <label><input type="radio" value="0" v-model="data.battery"><pre>0</pre></label> <label><input type="radio" value="1" v-model="data.battery"><pre>1</pre></label> <label><input type="radio" value="2" v-model="data.battery"><pre>2</pre></label> <label><input type="radio" value="3" v-model="data.battery"><pre>3</pre>+</label><br>
              Lit Label: <label><input type="checkbox" value="CAR" v-model="data.label">CAR <pre>C</pre></label> <label><input type="checkbox" value="FRK" v-model="data.label">FRK <pre>F</pre></label><br>
              Strike: <label><input type="radio" value="0" v-model="data.strike">0</label> <label><input type="radio" value="1" v-model="data.strike">1</label> <label><input type="radio" value="2" v-model="data.strike">2</label> <span class="action"><pre>\\</pre> to add strike</span>
            </p>
          </div>
        `
      });
      var out = new t({
        propsData: {
          data: this.gstate
        }
      });
      out.$mount();
      while (gstate.container.firstChild) {
        gstate.container.firstChild.remove();
      }
      gstate.container.appendChild(out.$el);
    },
    unknown: function() {
      var t = Vue.extend({
        template: '<div><h1>Command cannot be processed. (? for Help)</h2></div>'
      });
      var out = new t();
      out.$mount();
      this.gstate.container.appendChild(out.$el);
    },
    help: function() {
      var t = Vue.extend({
        template: '#help'
      });
      var out = new t();
      out.$mount();
      this.gstate.container.appendChild(out.$el);
    },
    submit: function(cmd) {
      cmd = cmd.toUpperCase().trim();
      for (let i = 0; i < this.subjects.length; i++) {
        if (this.subjects[i].process(cmd)) {
          cmd = '';
          
          if (!(this.subjects[i] instanceof SubjectPassword))
            this.subjects.unshift(this.subjects.splice(i, 1)[0]);
          break;
        }
      }
      if (cmd == 'NEW') {
        this.init();
      } else if (cmd == '?') {
        this.help();
      } else if (cmd != '') {
        this.unknown();
      }
      this.insertCmd();

      var container = this.$el.querySelector("#result");
      container.scrollTop = container.scrollHeight;
    }
  }
});

