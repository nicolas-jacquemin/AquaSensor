#include "commands.h"

commands_t commands[] = {
  {"relayon", &relay_on},
  {"relayoff", &relay_off},
  {"relayonrange", &relay_on_range},
  {"relayoffrange", &relay_off_range},
  {"nfoadd", &nfo_add},
  {"nforem", &nfo_rem},
  {NULL, NULL}
};

void execute_command(char *cname, char **args) {
  for (int i = 0; commands[i].cname; i++) {
    if (!strcmp(cname, commands[i].cname)) {
      commands[i].cfunc(args);
      return;
    }
  }
}