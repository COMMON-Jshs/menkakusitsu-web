import { v1 } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  TableBody,
  Input,
  SxProps,
  Theme,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Api } from "@/utils";
import { SubmitButton } from "@/components/basics/StyledButton";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type TimetableProps = {
  edit?: boolean;
};

export function TimetablePanel(props: TimetableProps) {
  const [timetable, setTimetable] = useState<v1.Timetable | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tableCellSx: SxProps<Theme> = { fontSize: "16px" };

  useEffect(() => {
    Api.getTimetable({
      when: dayjs().startOf("day").format("YYYY-MM-DD"),
    }).then((result) => {
      setTimetable(result.timetable);
      setIsLoading(false);
    });
  }, []);

  const onPutTimetable = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const timetableCells: v1.TimetableCell[] = [];
    for (const key of data.keys()) {
      const value = data.get(key);
      if (!key || !value) {
        continue;
      }
      timetableCells.push({ key: key, value: value.toString() });
    }
    Api.putTimetable({
      timetableInfo: timetableCells,
      when: dayjs().startOf("day").format("YYYY-MM-DD"),
    }).then((result) => {
      console.log("fin");
    });
  };

  return (
    <Box component="form" onSubmit={onPutTimetable}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={tableCellSx}></TableCell>
              <TableCell align="center" sx={tableCellSx}>
                1학년 1반
              </TableCell>
              <TableCell align="center" sx={tableCellSx}>
                1학년 2반
              </TableCell>
              <TableCell align="center" sx={tableCellSx}>
                2학년 1반
              </TableCell>
              <TableCell align="center" sx={tableCellSx}>
                2학년 2반
              </TableCell>
              <TableCell align="center" sx={tableCellSx}>
                3학년 1반
              </TableCell>
              <TableCell align="center" sx={tableCellSx}>
                3학년 2반
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              timetable &&
              timetable.timetableInfo.map((timetableCells, i) => {
                if (i) {
                  return (
                    <StyledTableRow key={i}>
                      {timetableCells.map((timetableCell, j) => {
                        return (
                          <TableCell
                            key={
                              timetableCell.key
                                ? timetableCell.key
                                : `nokey_${i}_${j}`
                            }
                            sx={tableCellSx}
                            align="center"
                          >
                            {props.edit ? (
                              <Input
                                defaultValue={timetableCell.value}
                                name={timetableCell.key}
                                size="small"
                              />
                            ) : (
                              timetableCell.value
                            )}
                          </TableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                }
                return <></>;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {props.edit && (
        <Box sx={{ textAlign: "center", marginTop: "16px" }}>
          <SubmitButton backgroundColor="primary.main" width="25%">
            수정하기
          </SubmitButton>
        </Box>
      )}
    </Box>
  );
}

export default TimetablePanel;
