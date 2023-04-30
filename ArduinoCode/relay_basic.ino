
void relay_on(char **args) {
  int pin_nb = atoi(args[0]);
  pinMode(pin_nb, OUTPUT);
  digitalWrite(pin_nb, 0);
}

void relay_off(char **args) {
  int pin_nb = atoi(args[0]);
  pinMode(pin_nb, OUTPUT);
  digitalWrite(pin_nb, 1);
}

void relay_on_range(char **args) {
  int pin_nb_start = atoi(args[0]);
  int pin_nb_end = atoi(args[1]);
  for (int i = pin_nb_start; i <= pin_nb_end; i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i, 0);
  }
}

void relay_off_range(char **args) {
  int pin_nb_start = atoi(args[0]);
  int pin_nb_end = atoi(args[1]);
  for (int i = pin_nb_start; i <= pin_nb_end; i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i, 1);
  }
}