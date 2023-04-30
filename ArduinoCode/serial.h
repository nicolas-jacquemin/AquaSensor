#pragma once

void serial_setup(void);
void serial_event(void);
void serial_loop(uint32_t timeout);
void afterCommand(char *cmd);