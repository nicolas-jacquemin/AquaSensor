#include "serial.h"
#include "lib.h"
#include "commands.h"

void setup() {
  serial_setup();
}

void serialEvent() {
  serial_event();
}

void loop() {
  serial_loop(2000);
  delay(1);
}

void afterCommand(char *cmd) {
  int num;
  char **tab = split(cmd, ",", &num);
  if (num) {
    execute_command(tab[0], &tab[1]);
  }
  free_sarr(tab);
}