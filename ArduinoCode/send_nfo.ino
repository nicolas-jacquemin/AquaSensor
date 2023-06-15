int *analogToRead = (int *)malloc(sizeof(int));

void nfo_setup(void) {
    analogToRead[0] = -1;
}

void add_to_reader(int pin_nb) {
    int i;
    for (i = 0; analogToRead[i] != -1; i++) {
        if (analogToRead[i] == pin_nb) {
            return;
        }
    }
    analogToRead = (int *)realloc(analogToRead, sizeof(int) * (i + 1));
    analogToRead[i] = pin_nb;
    analogToRead[i + 1] = -1;
}

void rem_from_reader(int pin_nb) {
    int i;
    for (i = 0; analogToRead[i] != -1; i++) {
        if (analogToRead[i] == pin_nb) {
            analogToRead[i] = -2;
        }
    }
}

void nfo_add(char **args) {
    int pin_nb = atoi(args[0]);
    add_to_reader(pin_nb);
}

void nfo_rem(char **args) {
    int pin_nb = atoi(args[0]);
    rem_from_reader(pin_nb);
}

void print_nfo(uint32_t timeout) {
    static uint32_t elapsed = 0;
    if (elapsed < timeout) {
        elapsed += 1;
        return;
    }
    elapsed = 0;
    Serial.print("nfo,");
    for (int i = 0; analogToRead[i] != -1; i++) {
        if (analogToRead[i] == -2)
            continue;
        Serial.print(analogToRead[i]);
        Serial.print(",");
        Serial.print(analogRead(analogToRead[i]));
    }
    Serial.println(";");
}