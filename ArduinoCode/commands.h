#pragma once

typedef struct commands {
  char *cname;
  void (*cfunc)(char **args);
} commands_t;

void execute_command(char *cname, char **args);
void relay_on(char **);
void relay_off(char **);
void relay_on_range(char **args);
void relay_off_range(char **args);