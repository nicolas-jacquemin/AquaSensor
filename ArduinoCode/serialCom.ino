char *command = malloc(sizeof(char));
uint32_t elapsed = 0;
bool in = false;

void serial_setup(void) {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  digitalWrite(13, 0);
}

void endSerial(void) {
  digitalWrite(13, 0);
  elapsed = 0;
  in = false;
  afterCommand(command);
  free(command);
}

void abortSerial(void) {
  digitalWrite(13, 0);
  elapsed = 0;
  in = false;
  free(command);
}

void serial_event(void) {
  elapsed = 0;
  char c = Serial.read();
  if (c == '\n')
    return;
  if (!in) {
    command = malloc(sizeof(char));
    command[0] = NULL;
    in = true;
    digitalWrite(13, 1);
  }
  if (c == ';') {
    endSerial();
    return;
  }
  int l = strlen(command);
  command = realloc(command, sizeof(char) * (l + 2));
  command[l] = c;
  command[l + 1] = NULL;
}

void serial_loop(uint32_t timeout) {
  if (in) {
    elapsed += 1;
    if (elapsed >= timeout)
      abortSerial();
  }
}
